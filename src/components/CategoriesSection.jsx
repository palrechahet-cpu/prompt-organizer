export default function CategoriesSection({ categories, activeCategory, onCategoryChange, onAddCategory, onDeleteCategory, userCategories = [] }) {
  const categoryConfig = {
    'All':            { emoji: '✨' },
    'Research':       { emoji: '📚' },
    'Writing':        { emoji: '✍️' },
    'Education':      { emoji: '🎓' },
    'Psychology':     { emoji: '🧠' },
    'AI':             { emoji: '🤖' },
    'Productivity':   { emoji: '⚡' },
    'Creative':       { emoji: '🎨' },
    'Health & Fitness': { emoji: '💪' },
    'Tech & Coding':  { emoji: '💻' },
    'Social Media':   { emoji: '📱' },
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
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap active:scale-95 hover:-translate-y-0.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30 border border-orange-400'
                    : 'bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-500/30 hover:text-orange-500 dark:hover:text-orange-400 hover:shadow-md'
                }`}
              >
                <span className="text-base">{config.emoji}</span>
                <span>{c}</span>
              </button>
              {isUserCategory && onDeleteCategory && (
                <button
                  onClick={() => onDeleteCategory(c)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs hidden group-hover/cat:flex items-center justify-center leading-none"
                >
                  ×
                </button>
              )}
            </div>
          )
        })}
        {/* Add custom category button */}
        <button
          onClick={onAddCategory}
          className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap bg-white dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-700 text-gray-400 hover:border-orange-300 hover:text-orange-500 hover:shadow-md active:scale-95"
        >
          <span>+</span>
          <span>New Category</span>
        </button>
      </div>
    </section>
  )
}