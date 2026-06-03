export default function CategoriesSection({ categories, activeCategory, onCategoryChange }) {
  const categoryConfig = {
    'All':            { emoji: '✨', color: 'orange' },
    'Research':       { emoji: '📚', color: 'blue' },
    'Writing':        { emoji: '✍️', color: 'purple' },
    'Education':      { emoji: '🎓', color: 'cyan' },
    'Psychology':     { emoji: '🧠', color: 'pink' },
    'AI':             { emoji: '🤖', color: 'orange' },
    'Productivity':   { emoji: '⚡', color: 'green' },
    'Creative':       { emoji: '🎨', color: 'violet' },
    'Health & Fitness': { emoji: '💪', color: 'emerald' },
    'Tech & Coding':  { emoji: '💻', color: 'sky' },
    'Social Media':   { emoji: '📱', color: 'rose' },
  }

  return (
    <section className="mb-8">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-4">Browse Categories</h2>
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => {
          const config = categoryConfig[c] || { emoji: '📌', color: 'gray' }
          const isActive = activeCategory === c
          return (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap active:scale-95 hover:-translate-y-0.5 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30 border border-orange-400'
                  : 'bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-500/30 hover:text-orange-500 dark:hover:text-orange-400 hover:shadow-md'
              }`}
            >
              <span className="text-base">{config.emoji}</span>
              <span>{c}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}