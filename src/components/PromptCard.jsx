export default function PromptCard({ prompt, onFavorite, onCopy, onDelete, compact = false }) {
  return (
    <div className={`bg-white p-3 sm:p-4 rounded-lg border border-gray-100 flex flex-col h-full transition hover:shadow-md ${!compact ? 'shadow-sm' : ''}`}>
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-900 truncate ${compact ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'}`}>{prompt.title}</h3>
          <div className="text-xs text-gray-500 truncate">{prompt.category}</div>
        </div>
        <button
          onClick={onFavorite}
          title="Favorite"
          className={`flex-shrink-0 text-lg sm:text-xl transition active:scale-75 ${prompt.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`}
        >
          ★
        </button>
      </div>

      <p className={`text-gray-700 line-clamp-3 flex-1 ${compact ? 'text-xs' : 'text-sm'}`}>{prompt.prompt}</p>

      <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2">
        <div className="flex gap-1 flex-wrap">
          {prompt.tags && prompt.tags.slice(0, compact ? 1 : 3).map(t => (
            <span key={t} className={`bg-gray-100 text-gray-700 rounded px-2 py-0.5 truncate ${compact ? 'text-xs' : 'text-xs'}`}>
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex gap-2">
        <button
          onClick={onCopy}
          title="Copy"
          className="flex-1 px-2 sm:px-3 py-1.5 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition active:scale-95"
        >
          Copy
        </button>
        {!prompt.builtIn && (
          <button
            onClick={onDelete}
            title="Delete"
            className="px-2 sm:px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium active:scale-95"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
