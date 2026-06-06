import PromptCard from './PromptCard'

export default function FeaturedSection({ prompts = [], onFavorite, onCopy, onDelete, onShare }) {
  const featured = prompts.filter(p => p.builtIn).slice(0, 4)
  if (featured.length === 0) return null
  return (
    <section className="mb-10 sm:mb-14 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50/50 to-transparent dark:from-orange-950/20 dark:via-amber-950/10 dark:to-transparent rounded-3xl pointer-events-none" />
      <div className="relative rounded-3xl border border-orange-100 dark:border-orange-900/30 p-6 sm:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 rounded-full text-xs font-bold">
              Featured
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Expert Prompts</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hand-picked prompts ready to copy and use instantly.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map(p => (
            <PromptCard
              key={p.id}
              prompt={p}
              onFavorite={() => onFavorite(p.id)}
              onCopy={() => onCopy(p.prompt)}
              onDelete={() => onDelete(p.id)}
              onShare={() => onShare(p)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
import PromptCard from './PromptCard'

export default function FeaturedSection({ prompts = [], onFavorite, onCopy, onDelete, onShare, onAddToCollection }) {
  const featured = prompts.filter(p => p.builtIn).slice(0, 4)
  if (featured.length === 0) return null
  return (
    <section className="mb-10 sm:mb-14 relative">
      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 dark:opacity-20"
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, transparent), color-mix(in srgb, var(--color-secondary) 4%, transparent), transparent)' }}
      />
      <div className="relative rounded-3xl border p-6 sm:p-10 overflow-hidden"
        style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-10"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                color: 'var(--color-primary)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)'
              }}
            >
              ⭐ Featured
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Expert Prompts</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hand-picked prompts ready to copy and use instantly.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map(p => (
            <PromptCard
              key={p.id}
              prompt={p}
              onFavorite={() => onFavorite(p.id)}
              onCopy={() => onCopy(p.prompt)}
              onDelete={() => onDelete(p.id)}
              onShare={() => onShare(p)}
              onAddToCollection={() => onAddToCollection && onAddToCollection(p)}
            />
          ))}
        </div>
 1                                  77777777777777777777     </div>
    </section>
  )
}