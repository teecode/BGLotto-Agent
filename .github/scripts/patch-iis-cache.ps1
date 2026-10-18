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

With -CheckUrl, the live site is asked for a page after the change. A web.config IIS
cannot read makes it answer every request with HTTP 500, so in that case the previous
web.config is put back and the step fails. (An earlier version asked appcmd to read the
configuration instead; on the build server that check failed the deploy by itself.)
The same script is used by maxi-lotto-agent-web, maxi-lotto.onlineadmin-web and
maxi-lotto-retailadmin-web; keep the copies in step.
#>
param(
  [Parameter(Mandatory = $true)] [string] $SiteFolder,
  [switch] $ImmutableAssets,
  [string] $CheckUrl = ''
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

if (-not $CheckUrl) {
  Write-Host 'No -CheckUrl given, so the live site was not checked.'
  return
}

# HTTP status of the live page; 0 when the site could not be reached at all.
function Get-Status([string] $url) {
  $separator = if ($url.Contains('?')) { '&' } else { '?' }
  try {
    return [int](Invoke-WebRequest -Uri "$url${separator}deploy-check=$([DateTime]::UtcNow.Ticks)" -UseBasicParsing -TimeoutSec 30).StatusCode
  } catch {
    $response = $_.Exception.Response
    if ($response) { return [int]$response.StatusCode }
    return 0
  }
}

$status = Get-Status $CheckUrl
if ($status -ge 500) {
  Start-Sleep -Seconds 3
  $status = Get-Status $CheckUrl
}
if ($status -ge 500) {
  if ($existed) { [IO.File]::WriteAllText($path, $original) } else { Remove-Item -LiteralPath $path }
  throw "$CheckUrl answered HTTP $status after the web.config change, so the previous web.config was restored."
}
if ($status -eq 0) {
  Write-Warning "Could not reach $CheckUrl to check the site; the updated web.config stays."
} else {
  Write-Host "$CheckUrl answers HTTP $status with the updated web.config."
}
