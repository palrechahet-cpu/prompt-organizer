import { useState } from 'react'

function CollectionNode({ collection, level, activeCollection, onSelectCollection, onDeleteCollection, onShareCollection, getCount }) {
  return (
    <div className="group/col relative" style={{ marginLeft: `${level * 10}px` }}>
      <button
        onClick={() => onSelectCollection(collection)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
        style={activeCollection?.id === collection.id ? {
          background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
          color: 'white',
          boxShadow: `0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)`
        } : { color: '#6b7280' }}
        onMouseEnter={e => { if (activeCollection?.id !== collection.id) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)' }}
        onMouseLeave={e => { if (activeCollection?.id !== collection.id) e.currentTarget.style.backgroundColor = '' }}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-base shadow-sm">{collection.emoji}</span>
        <span className="flex-1 text-left truncate">{collection.name}</span>
        <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-bold opacity-80">{getCount(collection)}</span>
      </button>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 items-center hidden group-hover/col:flex">
        <button
          onClick={(e) => { e.stopPropagation(); onShareCollection && onShareCollection(collection) }}
          title="Share"
                aria-label={`Share collection ${collection.name}`}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] text-gray-500 shadow-sm ring-1 ring-slate-200 hover:text-orange-500"
        >🔗</button>
        <button
                onClick={() => onDeleteCollection(collection.id)}
                aria-label={`Delete collection ${collection.name}`}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow-sm"
        >×</button>
      </div>
    </div>
  )
}

export default function CollectionsSidebar({ collections, activeCollection, onSelectCollection, onAddCollection, onDeleteCollection, onShareCollection, prompts }) {
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('📁')
  const [newParentId, setNewParentId] = useState('')
  const [adding, setAdding] = useState(false)

  const emojis = ['📁', '💼', '🏠', '❤️', '⭐', '🔥', '🎯', '🚀', '💡', '🌟', '🎨', '💻', '📝', '🔬', '🎓']
  const rootCollections = collections.filter(col => !col.parentId)

  const handleAdd = () => {
    if (!newName.trim()) return
    onAddCollection({ name: newName.trim(), emoji: newEmoji, parentId: newParentId || null })
    setNewName('')
    setNewEmoji('📁')
    setNewParentId('')
    setAdding(false)
  }

  const getCount = (collection) => {
    if (!collection) return 0
    return prompts.filter(p => p.collections?.includes(collection.id)).length
  }

  const renderCollectionTree = (parentId = null, level = 0) => {
    const children = collections.filter(col => col.parentId === parentId)
    return children.map(col => (
      <div key={col.id}>
        <CollectionNode
          collection={col}
          level={level}
          activeCollection={activeCollection}
          onSelectCollection={onSelectCollection}
          onDeleteCollection={onDeleteCollection}
          onShareCollection={onShareCollection}
          getCount={getCount}
        />
        {renderCollectionTree(col.id, level + 1)}
      </div>
    ))
  }

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col gap-2" role="navigation" aria-label="Collections">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 sticky top-24">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">Collections</h2>

        <button
          onClick={() => onSelectCollection(null)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          aria-label="Show all prompts"
          style={activeCollection === null ? {
            background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
            color: 'white',
            boxShadow: `0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)`
          } : {}}
          onMouseEnter={e => { if (activeCollection !== null) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)' }}
          onMouseLeave={e => { if (activeCollection !== null) e.currentTarget.style.backgroundColor = '' }}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-base shadow-sm">✨</span>
          <span className="flex-1 text-left" style={activeCollection === null ? {} : { color: 'var(--color-primary)' }}>All Prompts</span>
          <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-bold opacity-80">{prompts.length}</span>
        </button>

        {rootCollections.length > 0 && renderCollectionTree()}

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
            <select
              value={newParentId}
              onChange={e => setNewParentId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition"
            >
              <option value="">Top level collection</option>
              {collections.map(col => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
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
                onClick={() => { setAdding(false); setNewName(''); setNewParentId('') }}
                className="flex-1 py-1.5 bg-gray-100 dark:bg-zinc-700 text-gray-500 rounded-lg text-xs font-bold"
              >Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-500 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-slate-400"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-base shadow-sm dark:bg-zinc-900">+</span>
            <span>New Collection</span>
          </button>
        )}
      </div>
    </aside>
  )
}