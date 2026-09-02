export default async function copyToClipboard(text) {
  if (!text) return Promise.reject(new Error('No text to copy'))
  // Try Clipboard API first
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (err) {
      // fall through to fallback
    }
  }
  // Fallback method
  return new Promise((resolve, reject) => {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : null
      textarea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
      }
      if (successful) resolve()
      else reject(new Error('Copy command was unsuccessful'))
    } catch (e) {
      reject(e)
    }
  })
}
