// Memoized utility components for better performance
import { memo, useState, useEffect } from 'react'

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

// Highlight matching text in search results
export function highlightMatch(text, query) {
  if (!query || !text) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = String(text).split(regex)
  return parts.map((part, i) => 
    regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 text-inherit rounded px-0.5">{part}</mark> : part
  )
}
export const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <span className="text-4xl animate-bounce">🎯</span>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
))

export const SkeletonCard = memo(() => (
  <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/6 p-4 animate-pulse">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-1 h-10 bg-gray-200 dark:bg-zinc-700 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/4" />
      </div>
    </div>
    <div className="space-y-2 mb-3">
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded" />
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-5/6" />
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-4/6" />
    </div>
    <div className="flex gap-2 pt-3 border-t border-gray-50 dark:border-white/5">
      <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded-lg flex-1" />
      <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded-lg flex-1" />
      <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded-lg flex-1" />
    </div>
  </div>
))

export const EmptySearchState = memo(({ query }) => (
  <div className="col-span-full text-center py-16 text-gray-400 dark:text-gray-600">
    <p className="text-4xl mb-3">🔍</p>
    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No prompts found</p>
    {query && (
      <p className="text-sm mt-1">
        No results for "<span className="font-medium text-gray-500 dark:text-gray-400">{query}</span>"
      </p>
    )}
    <p className="text-sm mt-2">Try a different search or category</p>
  </div>
))

export const SearchBestMatch = memo(({ prompt, onCopy, onSaveToCollection, query }) => (
  <div className="col-span-full">
    <div className="sticky top-20 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-zinc-800 dark:to-zinc-800/80 border border-orange-200 dark:border-zinc-700 rounded-2xl p-4 mb-4 shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">✨ Best Match</span>
          </div>
          <p className="font-semibold text-gray-900 dark:text-white truncate">{query ? highlightMatch(prompt.title, query) : prompt.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
            {query ? highlightMatch(prompt.prompt, query) : prompt.prompt}
          </p>
          {prompt.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {prompt.tags.slice(0, 5).map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-white/80 dark:bg-zinc-700 text-gray-500 dark:text-gray-400 text-xs rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={() => onCopy(prompt.prompt, prompt.id)} 
            className="px-3 py-2 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 border border-gray-200 dark:border-zinc-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors"
          >
            Copy
          </button>
          <button 
            onClick={() => onSaveToCollection(prompt)} 
            className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
))

export const SearchResultCount = memo(({ count, total, query }) => {
  if (!query) return null
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Found <span className="font-semibold text-gray-700 dark:text-gray-200">{count}</span> result{count !== 1 ? 's' : ''}
        {total !== count && ` of ${total}`}
      </p>
      <p className="text-xs text-gray-400">
        for "<span className="font-medium">{query}</span>"
      </p>
    </div>
  )
})
