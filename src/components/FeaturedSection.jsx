import PromptCard from './PromptCard'

export default function FeaturedSection({ prompts, onFavorite, onCopy, onDelete }) {
  const featured = prompts.filter(p => p.builtIn)

  if (featured.length === 0) return null

  return (
    <section className="mb-8 sm:mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-8 border border-blue-100">
      <div className="mb-4 sm:mb-6">
        <span className="inline-block px-2.5 sm:px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold mb-2">
          Featured
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Expert Prompts</h2>
        <p className="text-xs sm:text-base text-gray-600">Discover our curated collection of AI prompts. Click to copy and customize.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {featured.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
            <PromptCard
              prompt={p}
              onFavorite={() => onFavorite(p.id)}
              onCopy={() => onCopy(p.prompt)}
              onDelete={() => onDelete(p.id)}
              compact={true}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
