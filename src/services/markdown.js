// Minimal, dependency-free Markdown -> HTML renderer for Maxi University text
// lessons. Deliberately supports a small safe subset (headings, bold/italic,
// inline code, bullet/numbered lists, tables, paragraphs) rather than pulling
// in a full markdown library. Input is HTML-escaped before any markup is
// applied, so raw HTML in the source can never be injected.

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inline(text) {
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>')
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>')
  return text
}

export function renderMarkdown(md) {
  if (!md) return ''
  // Normalize CRLF/CR to LF first - otherwise a stray trailing \r survives
  // the later split('\n') calls, and since JS regex `.` and `$` don't match
  // or anchor across \r, every ^...$ anchored rule below (headings, in
  // particular) silently fails to match on Windows-authored content.
  const normalized = md.replace(/\r\n?/g, '\n')
  const escaped = escapeHtml(normalized)
  const blocks = escaped.split(/\n\s*\n/)

  return blocks
    .map((block) => {
      const lines = block.split('\n').filter((l) => l.trim().length)
      if (!lines.length) return ''

      const headingMatch = lines[0].match(/^(#{1,6})\s+(.*)$/)
      if (lines.length === 1 && headingMatch) {
        const level = headingMatch[1].length
        return `<h${level}>${inline(headingMatch[2])}</h${level}>`
      }

      const isTable =
        lines.length >= 2 &&
        lines.every((l) => l.trim().startsWith('|')) &&
        /^\|?\s*-+\s*\|/.test(lines[1])
      if (isTable) {
        const headerCells = lines[0].split('|').map((c) => c.trim()).filter(Boolean)
        const bodyRows = lines
          .slice(2)
          .map((l) => l.split('|').map((c) => c.trim()).filter(Boolean))
        const thead = `<thead><tr>${headerCells.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>`
        const tbody = `<tbody>${bodyRows
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody>`
        return `<table class="md-table">${thead}${tbody}</table>`
      }

      if (lines.every((l) => /^[-*]\s+/.test(l.trim()))) {
        const items = lines
          .map((l) => `<li>${inline(l.trim().replace(/^[-*]\s+/, ''))}</li>`)
          .join('')
        return `<ul>${items}</ul>`
      }

      if (lines.every((l) => /^\d+\.\s+/.test(l.trim()))) {
        const items = lines
          .map((l) => `<li>${inline(l.trim().replace(/^\d+\.\s+/, ''))}</li>`)
          .join('')
        return `<ol>${items}</ol>`
      }

      return `<p>${lines.map(inline).join('<br>')}</p>`
    })
    .join('\n')
}
