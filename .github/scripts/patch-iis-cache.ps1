<#
Adds caching rules to the web.config that lives on the server, so a deploy reaches people
without a hard refresh. This app's web.config is not in the repository, and the server's
copy has rules of its own (the socket.io reverse proxy, the SPA fallback), so it is
patched, never replaced. Runs on every deploy; rules already there are left alone.

  - every HTML response gets Cache-Control: no-cache: browsers always ask for a newer
    copy (a quick 304 when there is none) instead of keeping index.html for hours;
  - a missing script, stylesheet or /assets file gets a real 404 instead of the app's
    HTML, which broke the page when loaded as a script and which Cloudflare kept under
    the file's address for hours;
  - with -ImmutableAssets, /assets (content-hashed build output) is cached for a year.

If IIS cannot read the result, the previous web.config is put back and the step fails.
The same script is used by maxi-lotto-agent-web, maxi-lotto.onlineadmin-web and
maxi-lotto-retailadmin-web; keep the copies in step.
#>
param(
  [Parameter(Mandatory = $true)] [string] $SiteFolder,
  [switch] $ImmutableAssets,
  # For testing against IIS Express; on the server the defaults are right.
  [string] $AppCmd = "$env:windir\System32\inetsrv\appcmd.exe",
  [string] $AppHostConfig = ''
)
$ErrorActionPreference = 'Stop'

$path = Join-Path $SiteFolder 'web.config'
$existed = Test-Path -LiteralPath $path
$original = if ($existed) { [IO.File]::ReadAllText($path) } else { $null }

$xml = New-Object System.Xml.XmlDocument
$xml.PreserveWhitespace = $true
if ($existed) { $xml.LoadXml($original) } else { $xml.LoadXml('<?xml version="1.0" encoding="UTF-8"?><configuration></configuration>') }
$changes = @()

function Get-Child([System.Xml.XmlNode] $parent, [string] $name) {
  $node = $parent.SelectSingleNode($name)
  if (-not $node) { $node = $parent.AppendChild($xml.CreateElement($name)) }
  return $node
}
function New-Fragment([string] $markup) {
  $fragment = $xml.CreateDocumentFragment()
  $fragment.InnerXml = $markup
  return $fragment
}
# A <clear/> empties the collection of everything listed before it, so add after it.
function Add-First([System.Xml.XmlNode] $parent, [string] $markup) {
  $fragment = New-Fragment $markup
  $clear = $parent.SelectSingleNode('clear')
  if ($clear) { [void]$parent.InsertAfter($fragment, $clear) }
  elseif ($parent.FirstChild) { [void]$parent.InsertBefore($fragment, $parent.FirstChild) }
  else { [void]$parent.AppendChild($fragment) }
}

$rewrite = Get-Child (Get-Child $xml.DocumentElement 'system.webServer') 'rewrite'

$rules = Get-Child $rewrite 'rules'
if (-not $rules.SelectSingleNode("rule[@name='MaxiLotto-MissingBuildFiles404']")) {
  # First, so it runs before the SPA fallback; socket.io is left to the proxy rule.
  Add-First $rules ('<rule name="MaxiLotto-MissingBuildFiles404" stopProcessing="true">' +
    '<match url="^(?!socket\.io)(assets/.*|.*\.(js|mjs|css|map))$" />' +
    '<conditions><add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /></conditions>' +
    '<action type="CustomResponse" statusCode="404" statusReason="Not Found" statusDescription="File not found" />' +
    '</rule>')
  $changes += 'missing build files return 404'
}

$outbound = Get-Child $rewrite 'outboundRules'
if (-not $outbound.SelectSingleNode("rule[@name='MaxiLotto-NoCacheHtml']")) {
  Add-First $outbound ('<rule name="MaxiLotto-NoCacheHtml" preCondition="MaxiLotto-IsHtml">' +
    '<match serverVariable="RESPONSE_Cache_Control" pattern=".*" />' +
    '<action type="Rewrite" value="no-cache" />' +
    '</rule>')
  $changes += 'HTML is no-cache'
}
$preConditions = Get-Child $outbound 'preConditions'
if (-not $preConditions.SelectSingleNode("preCondition[@name='MaxiLotto-IsHtml']")) {
  [void]$preConditions.AppendChild((New-Fragment '<preCondition name="MaxiLotto-IsHtml"><add input="{RESPONSE_CONTENT_TYPE}" pattern="^text/html" /></preCondition>'))
}

if ($ImmutableAssets -and -not $xml.DocumentElement.SelectSingleNode("location[@path='assets']")) {
  [void]$xml.DocumentElement.AppendChild((New-Fragment ('<location path="assets"><system.webServer><staticContent>' +
    '<clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" cacheControlCustom="public, immutable" />' +
    '</staticContent></system.webServer></location>')))
  $changes += '/assets cached for a year'
}

if ($changes.Count -eq 0) {
  Write-Host 'web.config already has the caching rules.'
  return
}
$xml.Save($path)
Write-Host "web.config updated: $($changes -join '; ')."

# Ask IIS to read the site's configuration back. Any error in web.config would take the
# whole site down (HTTP 500.19), so in that case put the previous file back and fail.
if (-not (Test-Path -LiteralPath $AppCmd)) {
  Write-Warning "appcmd not found at $AppCmd; the new web.config was not checked."
  return
}
$extra = @()
if ($AppHostConfig) { $extra += "/apphostconfig:$AppHostConfig" }
$target = (Resolve-Path -LiteralPath $SiteFolder).Path.TrimEnd('\')
try {
  [xml]$vdirs = & $AppCmd list vdir /xml @extra
} catch {
  Write-Warning "Could not list the IIS sites ($($_.Exception.Message)); the new web.config was not checked."
  return
}
$vdir = $vdirs.appcmd.VDIR | Where-Object {
  [Environment]::ExpandEnvironmentVariables($_.physicalPath).TrimEnd('\') -ieq $target
} | Select-Object -First 1
if (-not $vdir) {
  Write-Warning "No IIS site points at $target; the new web.config was not checked."
  return
}
# IIS reads each section separately, so every section the file can touch is read back.
$site = $vdir.'VDIR.NAME'
$checks = @(
  @($site, 'system.webServer/rewrite/rules'),
  @($site, 'system.webServer/rewrite/outboundRules'),
  @($site, 'system.webServer/staticContent'),
  @("$($site.TrimEnd('/'))/assets", 'system.webServer/staticContent')
)
foreach ($c in $checks) {
  $check = & $AppCmd list config $c[0] "/section:$($c[1])" @extra 2>&1
  if ($LASTEXITCODE -ne 0 -or ($check -join "`n") -match 'ERROR \(') {
    if ($existed) { [IO.File]::WriteAllText($path, $original) } else { Remove-Item -LiteralPath $path }
    throw "IIS could not read the updated web.config ($($c[1])), so the previous one was restored: $(($check -join ' ').Trim())"
  }
}
Write-Host "IIS reads the updated configuration for $($vdir.'VDIR.NAME') without errors."
