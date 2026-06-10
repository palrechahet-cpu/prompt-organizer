import { useState } from 'react'
import ThemePanel from './ThemePanel'

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [showThemePanel, setShowThemePanel] = useState(false)

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

      <nav className="sticky top-0 z-40 bg-[#161b22] border-b border-[#30363d] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
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

              <button
                className="p-2 rounded-lg bg-[#21262d] border border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-gray-500 transition"
              >
              </button>

              {user && (
                <div className="flex items-center gap-2">
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border-2"
                    style={{ borderColor: 'var(--color-primary)' }}
                  />
                  <button
                    onClick={onSignOut}
                    className="hidden sm:block px-3 py-2 rounded-lg bg-[#21262d] border border-[#30363d] text-gray-400 hover:text-red-400 hover:border-red-500/40 transition text-sm"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}