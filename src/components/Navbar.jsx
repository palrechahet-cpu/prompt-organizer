import { useState, useRef, useEffect } from 'react'
import useFocusTrap from '../hooks/useFocusTrap'
import ThemePanel from './ThemePanel'

function StarIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} className="h-4 w-4" aria-hidden="true">
      <path d="M10 2.8L12.4 7.1L17.4 7.8L13.8 11.3L14.6 16.2L10 13.7L5.4 16.2L6.2 11.3L2.6 7.8L7.6 7.1L10 2.8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M8.8 3.2C5.5 3.2 3 5.6 3 8.9C3 11.4 4.3 13.1 6.5 13.1H7.4C7.9 13.1 8.3 13.5 8.3 14V14.6C8.3 15.1 8.7 15.5 9.2 15.5C12.1 15.5 14.6 13.7 15.5 11.2C16.5 8.5 15.5 5.4 13 4.2C12 3.6 10.5 3.2 8.8 3.2ZM7.4 6.8C7.4 6.3 7.8 5.9 8.3 5.9C8.8 5.9 9.2 6.3 9.2 6.8C9.2 7.3 8.8 7.7 8.3 7.7C7.8 7.7 7.4 7.3 7.4 6.8ZM11.2 8.7C11.2 8.2 11.6 7.8 12.1 7.8C12.6 7.8 13 8.2 13 8.7C13 9.2 12.6 9.6 12.1 9.6C11.6 9.6 11.2 9.2 11.2 8.7ZM6.8 9.8C6.8 9.3 7.2 8.9 7.7 8.9C8.2 8.9 8.6 9.3 8.6 9.8C8.6 10.3 8.2 10.7 7.7 10.7C7.2 10.7 6.8 10.3 6.8 9.8Z" fill="currentColor" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M6 5.5V4.7C6 3.8 6.8 3 7.7 3H12.3C13.2 3 14 3.8 14 4.7V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 5.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 8V14.2C6.5 15.1 7.2 15.8 8.1 15.8H11.9C12.8 15.8 13.5 15.1 13.5 14.2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SignOutIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M12.5 5.5V4.2C12.5 3.5 11.9 3 11.2 3H5.3C4.6 3 4 3.6 4 4.3V15.7C4 16.4 4.6 17 5.3 17H11.2C11.9 17 12.5 16.5 12.5 15.8V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 10H16M16 10L13.5 7.5M16 10L13.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronIcon({ open = false }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Navbar({ search, setSearch, darkMode, setDarkMode, showFavoritesOnly, setShowFavoritesOnly, user, onSignOut, currentTheme, onThemeChange, onDeleteAccount, onOpenTrash, onOpenShares }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [showThemePanel, setShowThemePanel] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleting, setDeleting] = useState(false)
  const profileRef = useRef(null)
  const menuRef = useRef(null)
  const deleteModalRef = useRef(null)
  useFocusTrap(deleteModalRef, () => setShowDeleteConfirm(false))

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (showProfileMenu) {
      // focus the first menu item when opened for keyboard users
      setTimeout(() => {
        const first = menuRef.current?.querySelector('[role="menuitem"]')
        first?.focus()
      }, 0)
    }
  }, [showProfileMenu])

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') return
    setDeleting(true)
    await onDeleteAccount()
    setDeleting(false)
  }

  return (
    <>
      {showThemePanel && (
        <ThemePanel
          currentTheme={currentTheme}
          darkMode={darkMode}
          onThemeChange={onThemeChange}
          onDarkModeChange={setDarkMode}
          onClose={() => setShowThemePanel(false)}
        />
      )}

      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <div ref={deleteModalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/8 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-xl">⚠️</div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-base">Delete Account</h2>
                <p className="text-xs text-gray-400">This cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This will permanently delete your account and all your data including prompts, collections, favorites, and settings.
            </p>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">
                Type <span className="text-red-500 font-bold">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== 'DELETE' || deleting}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete My Account'}
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput('') }}
                className="flex-1 py-3 bg-gray-100 dark:bg-white/6 text-gray-500 dark:text-gray-400 rounded-xl font-bold text-sm active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-40 bg-[#161b22] border-b border-[#30363d] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
                <span className="text-white font-bold text-lg">✦</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white truncate">AI Prompt Studio</h1>
                <p className="text-xs leading-none" style={{ color: 'var(--color-primary)' }}>by Het Palrecha</p>
              </div>
            </div>

            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search prompts..."
              className="hidden sm:flex flex-1 max-w-md px-4 py-2 rounded-lg border border-[#30363d] bg-[#0f1117] text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition"
              style={{ '--tw-ring-color': 'var(--color-primary)' }}
            />

            {mobileSearchOpen && (
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="sm:hidden flex-1 px-3 py-2 rounded-lg border border-[#30363d] bg-[#0f1117] text-gray-200 placeholder-gray-500 text-sm focus:outline-none transition"
              />
            )}

            <div className="flex items-center gap-2">
              {!mobileSearchOpen && (
                <button onClick={() => setMobileSearchOpen(true)} className="sm:hidden px-3 py-2 text-gray-400 hover:bg-[#21262d] rounded-lg transition">🔍</button>
              )}
              {mobileSearchOpen && (
                <button onClick={() => { setMobileSearchOpen(false); setSearch('') }} className="sm:hidden px-3 py-2 text-gray-400 hover:bg-[#21262d] rounded-lg transition">✕</button>
              )}

              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition whitespace-nowrap text-sm ${
                  showFavoritesOnly
                    ? 'border bg-[#21262d] border-[#30363d]'
                    : 'bg-[#21262d] text-gray-400 border border-[#30363d] hover:text-gray-200 hover:border-gray-500'
                }`}
                style={showFavoritesOnly ? { color: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
              >
                <StarIcon filled={showFavoritesOnly} />
                <span className="hidden sm:inline">Favorites</span>
              </button>

              <button
                onClick={() => setShowThemePanel(true)}
                className="p-2.5 rounded-xl bg-[#21262d] border border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-gray-500 transition inline-flex items-center justify-center"
                title="Appearance settings"
              >
                <PaletteIcon />
              </button>

              {/* Profile dropdown */}
              {user && (
                <div className="relative" ref={profileRef}>
                  <button
                    id="profile-button"
                    aria-haspopup="menu"
                    aria-controls="profile-menu"
                    aria-expanded={showProfileMenu}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowProfileMenu(s => !s) }
                      if (e.key === 'Escape') { setShowProfileMenu(false) }
                    }}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-[#21262d] border border-[#30363d] hover:border-gray-500 transition"
                  >
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-7 h-7 rounded-full border-2"
                      style={{ borderColor: 'var(--color-primary)' }}
                    />
                    <span className="hidden sm:block text-xs text-gray-300 max-w-[80px] truncate">{user.displayName?.split(' ')[0]}</span>
                    <ChevronIcon open={showProfileMenu} />
                  </button>

                  {/* Dropdown menu */}
                  {showProfileMenu && (
                    <div id="profile-menu" ref={menuRef} role="menu" aria-labelledby="profile-button" className="absolute right-0 top-full mt-2 w-48 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="px-3 py-2.5 border-b border-[#30363d]">
                        <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => { onSignOut(); setShowProfileMenu(false) }}
                        onKeyDown={(e) => { if (e.key === 'Escape') setShowProfileMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-[#21262d] transition text-left"
                      >
                        <SignOutIcon />
                        Sign out
                      </button>
                      <button
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => { onOpenTrash && onOpenTrash(); setShowProfileMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-[#21262d] transition text-left"
                      >
                        <TrashIcon />
                        Trash
                      </button>
                      <button
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => { typeof onOpenShares === 'function' && onOpenShares(); setShowProfileMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-[#21262d] transition text-left"
                      >
                        <span className="text-xs">📤</span>
                        My Shares
                      </button>
                      <button
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => { setShowDeleteConfirm(true); setShowProfileMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"
                      >
                        <TrashIcon />
                        Delete Account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}