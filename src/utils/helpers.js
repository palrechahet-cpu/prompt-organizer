// Memoized utility components for better performance
import { memo } from 'react'

export const THEME_COLORS = Object.freeze({
  orange: { primary: '#f97316', secondary: '#f59e0b' },
  blue:   { primary: '#3b82f6', secondary: '#06b6d4' },
  purple: { primary: '#8b5cf6', secondary: '#a855f7' },
  green:  { primary: '#22c55e', secondary: '#10b981' },
  rose:   { primary: '#f43f5e', secondary: '#ec4899' },
})

export function applyTheme(theme) {
  const c = THEME_COLORS[theme] || THEME_COLORS.orange
  document.documentElement.style.setProperty('--color-primary', c.primary)
  document.documentElement.style.setProperty('--color-secondary', c.secondary)
}

export function buildShareUrl(type, id) {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') || '/'
  const route = `${base === '/' ? '' : base}/${type === 'prompt' ? 's' : 'c'}/${id}`.replace(/\/+/g, '/')
  url.pathname = route
  return url.toString()
}

export function getRouteShareMeta() {
  const pathname = decodeURIComponent(window.location.pathname || '/')
  const match = pathname.match(/(?:^|\/)([sc])\/([^/]+)$/)
  if (!match) return null
  return { type: match[1] === 's' ? 'prompt' : 'collection', id: match[2] }
}

export function resetShareUrl() {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') || '/'
  url.pathname = base === '/' ? '/' : base
  window.history.replaceState({}, '', url.toString())
}

// Constants
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
export const MAX_RECENTLY_VIEWED = 5
export const SEARCH_DEBOUNCE_MS = 300

// Memoized helper components
export const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <span className="text-4xl animate-bounce">🎯</span>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
))

export const EmptySearchState = memo(() => (
  <div className="col-span-full text-center py-16 text-gray-400 dark:text-gray-600">
    <p className="text-4xl mb-3">🔍</p>
    <p className="text-lg font-medium">No prompts found</p>
    <p className="text-sm">Try a different search or category</p>
  </div>
))

export const SearchBestMatch = memo(({ prompt, onCopy, onSaveToCollection }) => (
  <div className="col-span-full">
    <div className="sticky top-20 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 mb-4 shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-400">Best Match</p>
          <p className="font-semibold text-gray-900 dark:text-white">{prompt.title}</p>
          <p className="text-xs text-gray-400 line-clamp-2 mt-1">{prompt.prompt}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onCopy(prompt.prompt, prompt.id)} className="px-3 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-xs">Copy</button>
          <button onClick={() => onSaveToCollection(prompt)} className="px-3 py-2 bg-orange-500 text-white rounded-lg text-xs">Save to Collection</button>
        </div>
      </div>
    </div>
  </div>
))
