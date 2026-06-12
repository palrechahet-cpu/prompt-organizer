import PromptCard from './PromptCard'

export default function SmartSection({ usageStats, allPrompts, recentlyViewed, onCopy, onFavorite, onDelete, onShare, onAddToCollection }) {

  const sortedByUsage = Object.entries(usageStats || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([id]) => allPrompts.find(p => String(p.id) === String(id)))
    .filter(Boolean)

  const recentPrompts = (recentlyViewed || [])
    .map(id => allPrompts.find(p => String(p.id) === String(id)))
    .filter(Boolean)
    .slice(0, 5)

  const hasUsage = sortedByUsage.length > 0
  const hasRecent = recentPrompts.length > 0

  if (!hasUsage && !hasRecent) return null

  return (
    <div className="flex flex-col gap-10 mb-10 sm:mb-14">

      {/* Recently Viewed */}
      {hasRecent && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">Recently Viewed</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                color: 'var(--color-primary)'
              }}
            >
              🕐 Recent
            </span>
          </div>

          {/* Horizontal scrollable strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recentPrompts.map(p => (
              <div
                key={p.id}
                className="flex-shrink-0 w-56 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/6 rounded-xl p-3 flex flex-col gap-2 hover:border-gray-200 dark:hover:border-white/12 transition-all duration-200 cursor-pointer"
                onClick={() => onCopy(p.prompt, p.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900 dark:text-white text-xs truncate flex-1">{p.title}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); onFavorite(p.id) }}
                    className="text-sm flex-shrink-0 transition-all hover:scale-110"
                    style={p.favorite ? { color: 'var(--color-primary)' } : { color: 'rgba(156,163,175,0.4)' }}
                  >★</button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">{p.prompt}</p>
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="text-xs text-gray-400 dark:text-gray-600">{p.category}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onCopy(p.prompt, p.id) }}
                    className="text-xs px-2 py-0.5 rounded-lg text-white transition-all active:scale-95"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Most Used */}
      {hasUsage && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">Your Most Used</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                color: 'var(--color-primary)'
              }}
            >
              ✦ Personalized
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedByUsage.map(p => (
              <PromptCard
                key={p.id}
                prompt={p}
                onFavorite={() => onFavorite(p.id)}
                onCopy={() => onCopy(p.prompt, p.id)}
                onDelete={() => onDelete(p.id)}
                onShare={() => onShare(p)}
                onAddToCollection={() => onAddToCollection(p)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}