function resolveSharePath(type) {
  return type === 'prompt' ? 's' : 'c'
}

function getBaseUrl() {
  const base = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.BASE_URL || '/') : '/'
  return base.endsWith('/') ? base : `${base}/`
}

export function buildShareUrl(type, id) {
  const route = resolveSharePath(type)
  if (typeof window === 'undefined') {
    return `${getBaseUrl()}${route}/${encodeURIComponent(id)}`
  }

  const base = getBaseUrl()
  const url = new URL(base, window.location.origin)
  const pathname = `${url.pathname.replace(/\/+$/, '')}/${route}/${encodeURIComponent(id)}`
  url.pathname = pathname
  url.search = ''
  return url.toString()
}

export function getRouteShareMeta() {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  const promptId = params.get('sharePrompt')
  const collectionId = params.get('shareCollection')
  if (promptId) return { type: 'prompt', id: promptId }
  if (collectionId) return { type: 'collection', id: collectionId }

  const pathname = decodeURIComponent(window.location.pathname || '/')
  const match = pathname.match(/(?:^|\/)([sc])\/([^/]+)$/)
  if (!match) return null
  return { type: match[1] === 's' ? 'prompt' : 'collection', id: match[2] }
}

export function resetShareUrl() {
  if (typeof window === 'undefined') return

  const url = new URL(getBaseUrl(), window.location.origin)
  window.history.replaceState({}, '', url.toString())
}

export async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {
    const input = document.createElement('textarea')
    input.value = text
    input.setAttribute('readonly', '')
    input.style.position = 'fixed'
    input.style.top = '0'
    input.style.left = '-9999px'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.select()
    input.setSelectionRange(0, input.value.length)
    let copied
    try {
      copied = document.execCommand?.('copy') || false
    } finally {
      input.remove()
    }
    if (!copied) throw new Error('Clipboard access is unavailable')
  }
}