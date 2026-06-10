import { useState, useRef, useEffect } from 'react'
import ThemePanel from './ThemePanel'

export default function Navbar({ search, setSearch, darkMode, setDarkMode, showFavoritesOnly, setShowFavoritesOnly, user, onSignOut, currentTheme, onThemeChange, onDeleteAccount }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [showThemePanel, setShowThemePanel] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleting, setDeleting] = useState(false)
  const profileRef = useRef(null)

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
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
                className={`px-3 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm ${
                  showFavoritesOnly
                    ? 'border bg-[#21262d] border-[#30363d]'
                    : 'bg-[#21262d] text-gray-400 border border-[#30363d] hover:text-gray-200 hover:border-gray-500'
                }`}
                style={showFavoritesOnly ? { color: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
              >
                ★ <span className="hidden sm:inline">Favorites</span>
              </button>

              <button
                onClick={() => setShowThemePanel(true)}
                className="p-2 rounded-lg bg-[#21262d] border border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-gray-500 transition"
                title="Appearance settings"
              >
                ⚙️
              </button>

              {/* Profile dropdown */}
              {user && (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-[#21262d] border border-[#30363d] hover:border-gray-500 transition"
                  >
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-7 h-7 rounded-full border-2"
                      style={{ borderColor: 'var(--color-primary)' }}
                    />
                    <span className="hidden sm:block text-xs text-gray-300 max-w-[80px] truncate">{user.displayName?.split(' ')[0]}</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="px-3 py-2.5 border-b border-[#30363d]">
                        <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { onSignOut(); setShowProfileMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-[#21262d] transition text-left"
                      >
                        <span>🚪</span>
                        Sign out
                      </button>
                      <button
                        onClick={() => { setShowDeleteConfirm(true); setShowProfileMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"
                      >
                        <span>🗑️</span>
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