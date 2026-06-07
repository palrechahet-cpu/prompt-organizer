import { useState } from 'react'

export default function CollectionsSidebar({ collections, activeCollection, onSelectCollection, onAddCollection, onDeleteCollection, prompts }) {
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('📁')
  const [adding, setAdding] = useState(false)

  const emojis = ['📁', '💼', '🏠', '❤️', '⭐', '🔥', '🎯', '🚀', '💡', '🌟', '🎨', '💻', '📝', '🔬', '🎓']

  const handleAdd = () => {
    if (!newName.trim()) return
    onAddCollection({ name: newName.trim(), emoji: newEmoji })
    setNewName('')
    setNewEmoji('📁')
    setAdding(false)
  }

  const getCount = (collection) => {
    if (!collection) return 0
    return prompts.filter(p => p.collections?.includes(collection.id)).length
  }

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col gap-2">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 sticky top-24">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">Collections</h2>

        {/* All Prompts */}
        <button
          onClick={() => onSelectCollection(null)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={activeCollection === null ? {
            background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
            color: 'white',
            boxShadow: `0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)`
          } : {}}
          onMouseEnter={e => { if (activeCollection !== null) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)' }}
          onMouseLeave={e => { if (activeCollection !== null) e.currentTarget.style.backgroundColor = '' }}
        >
          <span>✨</span>
          <span className="flex-1 text-left" style={activeCollection === null ? {} : { color: 'var(--color-primary)' }}>All Prompts</span>
          <span className="text-xs opacity-60">{prompts.length}</span>
        </button>

        {/* User collections */}
        {collections.map(col => (
          <div key={col.id} className="group/col relative">
            <button
              onClick={() => onSelectCollection(col)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={activeCollection?.id === col.id ? {
                background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
                color: 'white',
                boxShadow: `0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)`
              } : { color: '#6b7280' }}
              onMouseEnter={e => { if (activeCollection?.id !== col.id) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)' }}
              onMouseLeave={e => { if (activeCollection?.id !== col.id) e.currentTarget.style.backgroundColor = '' }}
            >
              <span>{col.emoji}</span>
              <span className="flex-1 text-left truncate">{col.name}</span>
              <span className="text-xs opacity-60">{getCount(col)}</span>
            </button>
            <button
              onClick={() => onDeleteCollection(col.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover/col:flex items-center justify-center"
            >×</button>
          </div>
        ))}

        {/* Add collection */}
        {adding ? (
          <div className="flex flex-col gap-2 mt-1 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
            <div className="flex flex-wrap gap-1">
              {emojis.map(e => (
                <button
                  key={e}
                  onClick={() => setNewEmoji(e)}
                  className="text-base p-1 rounded-lg transition"
                  style={newEmoji === e ? {
                    backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
                  } : {}}
                >
                  {e}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Collection name..."
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition"
              style={{ '--tw-ring-color': 'var(--color-primary)' }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 py-1.5 text-white rounded-lg text-xs font-bold transition"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >Create</button>
              <button
                onClick={() => setAdding(false)}
                className="flex-1 py-1.5 bg-gray-100 dark:bg-zinc-700 text-gray-500 rounded-lg text-xs font-bold"
              >Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 border border-dashed border-gray-200 dark:border-zinc-700 transition-all duration-200"
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = '' }}
          >
            <span>+</span>
            <span>New Collection</span>
          </button>
        )}
      </div>
    </aside>
  )
}