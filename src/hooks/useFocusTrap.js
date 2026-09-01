import { useEffect } from 'react'

function focusableSelectors() {
  return [
    'a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])',
    'button:not([disabled])', 'iframe', 'object', 'embed', '[tabindex]:not([tabindex="-1"])', '[contenteditable]'
  ].join(',')
}

export default function useFocusTrap(containerRef, onClose) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const focusable = Array.from(container.querySelectorAll(focusableSelectors())).filter(el => el.offsetParent !== null)
    if (focusable.length) focusable[0].focus()

    function handleKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose && onClose(); return }
      if (e.key === 'Tab') {
        if (focusable.length === 0) { e.preventDefault(); return }
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [containerRef, onClose])
}
