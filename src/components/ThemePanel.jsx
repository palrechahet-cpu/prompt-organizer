export const THEMES = {
  orange: {
    name: 'Orange',
    primary: '#f97316',
    classes: {
      btn: 'bg-orange-500 hover:bg-orange-600',
      btnGrad: 'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
      ring: 'focus:ring-orange-500',
      text: 'text-orange-500',
      border: 'border-orange-500',
      accent: 'bg-orange-500',
      shadow: 'shadow-orange-200 dark:shadow-orange-900/30',
      activeTab: 'bg-gradient-to-r from-orange-500 to-amber-500',
    }
  },
  blue: {
    name: 'Blue',
    primary: '#3b82f6',
    classes: {
      btn: 'bg-blue-500 hover:bg-blue-600',
      btnGrad: 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
      ring: 'focus:ring-blue-500',
      text: 'text-blue-500',
      border: 'border-blue-500',
      accent: 'bg-blue-500',
      shadow: 'shadow-blue-200 dark:shadow-blue-900/30',
      activeTab: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    }
  },
  purple: {
    name: 'Purple',
    primary: '#8b5cf6',
    classes: {
      btn: 'bg-violet-500 hover:bg-violet-600',
      btnGrad: 'from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600',
      ring: 'focus:ring-violet-500',
      text: 'text-violet-500',
      border: 'border-violet-500',
      accent: 'bg-violet-500',
      shadow: 'shadow-violet-200 dark:shadow-violet-900/30',
      activeTab: 'bg-gradient-to-r from-violet-500 to-purple-500',
    }
  },
  green: {
    name: 'Green',
    primary: '#22c55e',
    classes: {
      btn: 'bg-green-500 hover:bg-green-600',
      btnGrad: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
      ring: 'focus:ring-green-500',
      text: 'text-green-500',
      border: 'border-green-500',
      accent: 'bg-green-500',
      shadow: 'shadow-green-200 dark:shadow-green-900/30',
      activeTab: 'bg-gradient-to-r from-green-500 to-emerald-500',
    }
  },
  rose: {
    name: 'Rose',
    primary: '#f43f5e',
    classes: {
      btn: 'bg-rose-500 hover:bg-rose-600',
      btnGrad: 'from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
      ring: 'focus:ring-rose-500',
      text: 'text-rose-500',
      border: 'border-rose-500',
      accent: 'bg-rose-500',
      shadow: 'shadow-rose-200 dark:shadow-rose-900/30',
      activeTab: 'bg-gradient-to-r from-rose-500 to-pink-500',
    }
  }
}

export default function ThemePanel({ currentTheme, darkMode, onThemeChange, onDarkModeChange, onClose }) {
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/8 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-base">Appearance</h2>
            <p className="text-xs text-gray-400 mt-0.5">Customize your experience</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-xs"
          >✕</button>
        </div>

        {/* Mode toggle */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Mode</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onDarkModeChange(false)}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                !darkMode
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                  : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/8 hover:border-gray-300 dark:hover:border-white/15'
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => onDarkModeChange(true)}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/8 hover:border-gray-300 dark:hover:border-white/15'
              }`}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* Accent color */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Accent Color</p>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(THEMES).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => onThemeChange(key)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center ${
                    currentTheme === key
                      ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#111] scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: theme.primary,
                    ringColor: theme.primary
                  }}
                >
                  {currentTheme === key && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 dark:bg-white/4 rounded-xl p-4 border border-gray-100 dark:border-white/6">
          <p className="text-xs text-gray-400 mb-3 font-medium">Preview</p>
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 rounded-lg text-white text-xs font-medium transition-all"
              style={{ backgroundColor: THEMES[currentTheme]?.primary }}
            >
              Primary
            </button>
            <button className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-300 text-xs font-medium">
              Secondary
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
          Theme synced to your account ✓
        </p>
      </div>
    </div>
  )
}