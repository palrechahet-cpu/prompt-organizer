export default function CategoriesSection({ categories, activeCategory, onCategoryChange, onAddCategory, onDeleteCategory, userCategories = [] }) {
  const categoryConfig = {
    'All': { emoji: '✨' },
    'Research': { emoji: '📚' },
    'Writing': { emoji: '✍️' },
    'Education': { emoji: '🎓' },
    'AI': { emoji: '🤖' },
    'Productivity': { emoji: '⚡' },
    'Creative': { emoji: '🎨' },
    'Health & Fitness': { emoji: '💪' },
    'Tech & Coding': { emoji: '💻' },
    'Social Media': { emoji: '📱' },
    'Product & Strategy': { emoji: '🚀' },
    'Ideation & Brainstorm': { emoji: '💡' },
    'Leadership': { emoji: '🧭' },
    'Operations': { emoji: '🛠️' },
    'Sales': { emoji: '📈' },
    'Finance': { emoji: '💰' }
  }

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">Browse</p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Prompt categories</h2>
        </div>
        <button
          onClick={onAddCategory}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-zinc-900 dark:text-gray-300"
        >
          <span>＋</span>
          <span>New category</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(c => {
          const config = categoryConfig[c] || { emoji: '📁' }
          const isActive = activeCategory === c
          const isUserCategory = userCategories.includes(c)

          return (
            <div key={c} className="relative group/cat">
              <button
                onClick={() => onCategoryChange(c)}
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm active:scale-95"
                style={isActive ? {
                  background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
                  borderColor: 'var(--color-primary)',
                  color: '#fff',
                  boxShadow: `0 8px 18px color-mix(in srgb, var(--color-primary) 22%, transparent)`
                } : {
                  backgroundColor: 'rgba(255,255,255,0.75)',
                  borderColor: '#e5e7eb',
                  color: '#4b5563'
                }}
              >
                <span className="text-base">{config.emoji}</span>
                <span>{c}</span>
              </button>

              {isUserCategory && onDeleteCategory && (
                <button
                  onClick={() => onDeleteCategory(c)}
                  className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm group-hover/cat:flex"
                  aria-label={`Delete ${c}`}
                >
                  ×
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}