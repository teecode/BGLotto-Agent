// Detects the provider behind a Training Material link and returns an embeddable
// player URL when possible. Falls back to 'external' for anything unrecognized.
export function getEmbed(link) {
  if (!link) return { type: 'external', embedUrl: null }

  const youtube = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  if (youtube) {
    return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${youtube[1]}` }
  }

  const vimeo = link.match(/vimeo\.com\/(\d+)/)
  if (vimeo) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeo[1]}` }
  }

  if (/soundcloud\.com\//.test(link)) {
    return { type: 'soundcloud', embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(link)}` }
  }

  return { type: 'external', embedUrl: null }
}

export function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}
