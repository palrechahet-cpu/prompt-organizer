import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose, actionLabel, onAction }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300" aria-live="polite" aria-atomic="true">
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-max`} role="status">
        <span className="text-xl font-bold" aria-hidden>{icon}</span>
        <span className="font-medium">{message}</span>
        {actionLabel && onAction && (
          <button onClick={() => { try { onAction() } catch (e) { console.error('toast action', e) } }} className="ml-3 px-3 py-1 rounded-md bg-white text-sm font-semibold text-black/80">{actionLabel}</button>
        )}
        <div className={`absolute bottom-0 left-0 h-1 ${bgColor} rounded-full animate-pulse`} style={{ animation: 'shrink 3s linear forwards' }} aria-hidden></div>
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}
