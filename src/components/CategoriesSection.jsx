export default function CategoriesSection({ categories, activeCategory, onCategoryChange, onAddCategory, onDeleteCategory, userCategories = [] }) {
  const categoryConfig = {
    'All':                  { emoji: '✨' },
    'Research':             { emoji: '📚' },
    'Writing':              { emoji: '✍️' },
    'Education':            { emoji: '🎓' },
    'AI':                   { emoji: '🤖' },
    'Productivity':         { emoji: '⚡' },
    'Creative':             { emoji: '🎨' },
    'Health & Fitness':     { emoji: '💪' },
    'Tech & Coding':        { emoji: '💻' },
    'Social Media':         { emoji: '📱' },
    'Product & Strategy':   { emoji: '🚀' },
    'Ideation & Brainstorm': { emoji: '💡' },
  }
  return (
    <section className="mb-8">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-4">Browse Categories</h2>
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => {
          const config = categoryConfig[c] || { emoji: '📁' }
          const isActive = activeCategory === c
          const isUserCategory = userCategories.includes(c)
          return (
            <div key={c} className="relative group/cat">
              <button
                onClick={() => onCategoryChange(c)}
                className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap active:scale-95 hover:-translate-y-0.5 border"
                style={isActive ? {
                  background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
                  color: 'white',
                  borderColor: 'var(--color-primary)',
                  boxShadow: `0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)`
                } : {
                  backgroundColor: 'white',
                  borderColor: '#f3f4f6',
                  color: '#6b7280'
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--color-primary)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#6b7280' }}
              >
                <span className="text-base">{config.emoji}</span>
                <span>{c}</span>
              </button>
              {isUserCategory && onDeleteCategory && (
                <button
                  onClick={() => onDeleteCategory(c)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs hidden group-hover/cat:flex items-center justify-center leading-none"
                >×</button>
              )}
            </div>
          )
        })}
        <button
          onClick={onAddCategory}
          className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap bg-white dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-700 text-gray-400 active:scale-95"
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = '' }}
        >
          <span>+</span>
          <span>New Category</span>
        </button>
      </div>
    </section>
  )
}