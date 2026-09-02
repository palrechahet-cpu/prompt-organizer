export default function AddToCollectionModal({ prompt, collections, onAdd, onRemove, onClose }) {
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }
  const isInCollection = (col) => prompt.collections?.includes(col.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📁</span>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">Add to Collection</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl transition-colors">✕</button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">"{prompt.title}"</p>
        {collections.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No collections yet. Create one from the sidebar!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {collections.map(col => {
              const inCol = isInCollection(col)
              return (
                <button
                  key={col.id}
                  onClick={() => inCol ? onRemove(col.id) : onAdd(col.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    inCol
                      ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400'
                      : 'bg-gray-50 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-orange-200 hover:text-orange-500'
                  }`}
                >
                  <span>{col.emoji}</span>
                  <span className="flex-1 text-left">{col.name}</span>
                  {inCol && <span className="text-xs">✓ Added</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}