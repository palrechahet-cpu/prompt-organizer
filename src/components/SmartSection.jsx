import PromptCard from './PromptCard'

export default function SmartSection({ usageStats, allPrompts, onCopy, onFavorite, onDelete, onShare, onAddToCollection }) {
  if (!usageStats || Object.keys(usageStats).length === 0) return null

  // Sort prompts by usage count
  const sortedByUsage = Object.entries(usageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([id]) => allPrompts.find(p => String(p.id) === String(id)))
    .filter(Boolean)

  if (sortedByUsage.length === 0) return null

  return (
    <section className="mb-10 sm:mb-14">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
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
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">Based on your activity</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedByUsage.map(p => (
          <PromptCard
            key={p.id}
            prompt={p}
            onFavorite={() => onFavorite(p.id)}
            onCopy={() => onCopy(p.prompt)}
            onDelete={() => onDelete(p.id)}
            onShare={() => onShare(p)}
            onAddToCollection={() => onAddToCollection(p)}
          />
        ))}
      </div>
    </section>
  )
}