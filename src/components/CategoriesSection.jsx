export default function CategoriesSection({ categories, activeCategory, onCategoryChange }) {
  const categoryEmojis = {
    'Research': '📚',
    'Writing': '✍️',
    'Education': '🎓',
    'Psychology': '🧠',
    'AI': '🤖',
    'Productivity': '⚡',
    'All': '✨'
  }

  return (
    <section className="mb-6 sm:mb-8">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-600">Filter by Category</h2>
      </div>
      <div className="flex gap-1.5 sm:gap-2 flex-wrap overflow-x-auto pb-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => onCategoryChange(c)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 active:scale-95 ${
              activeCategory === c
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <span className="text-sm sm:text-base">{categoryEmojis[c] || '📌'}</span>
            <span className="hidden sm:inline">{c}</span>
            <span className="sm:hidden">{c.slice(0, 3)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
