import { useState } from 'react'

export default function Navbar({ search, onSearchChange, showFavorites, onFavoritesToggle }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 truncate">Prompt Organizer</h1>
              <p className="text-xs text-gray-600 leading-none">AI Prompt Manager</p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search prompts..."
            className="hidden sm:flex flex-1 max-w-md px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Mobile Search Toggle */}
          {mobileSearchOpen && (
            <input
              type="text"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search..."
              autoFocus
              className="sm:hidden flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!mobileSearchOpen && (
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="sm:hidden px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Search"
              >
                🔍
              </button>
            )}
            {mobileSearchOpen && (
              <button
                onClick={() => {
                  setMobileSearchOpen(false)
                  onSearchChange('')
                }}
                className="sm:hidden px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Close search"
              >
                ✕
              </button>
            )}
            <button
              onClick={onFavoritesToggle}
              className={`px-3 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm ${
                showFavorites
                  ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              ★ <span className="hidden sm:inline">Favorites</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
