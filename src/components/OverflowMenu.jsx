import React, { useRef, useEffect } from 'react'

export default function OverflowMenu({ open, onClose, actions = [] }) {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    const handleClickOutside = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) onClose() }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div ref={menuRef} className="absolute right-2 top-9 w-48 bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-white/8 rounded-lg shadow-lg py-1 z-50">
      {actions.map((a, i) => (
        <button
          key={i}
          onClick={() => { a.onClick(); onClose() }}
          className={`w-full text-left px-3 py-2 text-sm ${a.danger ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-50 dark:hover:bg-white/6`}
        >
          {a.icon && <span className="mr-2 inline-block align-middle">{a.icon}</span>}
          <span className="align-middle">{a.label}</span>
        </button>
      ))}
    </div>
  )
}
