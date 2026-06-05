import { useState } from 'react'
import RemixModal from './RemixModal'

function SendToAIModal({ prompt, onClose }) {
  const [editedPrompt, setEditedPrompt] = useState(prompt.prompt)

  const agents = [
    {
      name: 'ChatGPT',
      emoji: '🤖',
      color: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-200 dark:shadow-green-900/30',
      getUrl: (text) => `https://chatgpt.com/?q=${encodeURIComponent(text)}`
    },
    {
      name: 'Claude',
      emoji: '🧡',
      color: 'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-200 dark:shadow-orange-900/30',
      getUrl: (text) => `https://claude.ai/new?q=${encodeURIComponent(text)}`
    },
    {
      name: 'Gemini',
      emoji: '✨',
      color: 'from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-blue-200 dark:shadow-blue-900/30',
      getUrl: (text) => `https://gemini.google.com/app?q=${encodeURIComponent(text)}`
    }
  ]

  const handleSend = (agent) => {
    navigator.clipboard.writeText(editedPrompt)
    window.open(agent.getUrl(editedPrompt), '_blank')
    onClose()
  }

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">Send to AI</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl transition-colors">✕</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Prompt:</span>
          <span className="text-xs font-bold text-orange-500">{prompt.title}</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Edit before sending</label>
          <textarea
            value={editedPrompt}
            onChange={e => setEditedPrompt(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
          />
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{editedPrompt.length} characters · Also copies to clipboard</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 block">Choose AI Agent</label>
          <div className="flex flex-col gap-2">
            {agents.map(agent => (
              <button
                key={agent.name}
                onClick={() => handleSend(agent)}
                disabled={!editedPrompt.trim()}
                className={`w-full py-3 px-4 bg-gradient-to-r ${agent.color} text-white rounded-xl text-sm font-bold transition-all duration-200 shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <span className="text-base">{agent.emoji}</span>
                Open in {agent.name}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">Opens a new tab · Prompt copied to clipboard automatically</p>
      </div>
    </div>
  )
}

export default function PromptCard({ prompt, onFavorite, onCopy, onDelete, onShare, onAddToCollection }) {
  const [showAIModal, setShowAIModal] = useState(false)
  const [showRemixModal, setShowRemixModal] = useState(false)

  const categoryConfig = {
    Research:           { color: 'blue',    emoji: '📚' },
    Writing:            { color: 'purple',  emoji: '✍️' },
    AI:                 { color: 'orange',  emoji: '🤖' },
    Productivity:       { color: 'green',   emoji: '⚡' },
    Education:          { color: 'cyan',    emoji: '🎓' },
    Psychology:         { color: 'pink',    emoji: '🧠' },
    Creative:           { color: 'violet',  emoji: '🎨' },
    'Health & Fitness': { color: 'emerald', emoji: '💪' },
    'Tech & Coding':    { color: 'sky',     emoji: '💻' },
    'Social Media':     { color: 'rose',    emoji: '📱' },
  }

  const config = categoryConfig[prompt.category] || { color: 'gray', emoji: '📌' }

  const colorMap = {
    blue:    'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    purple:  'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
    orange:  'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20',
    green:   'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20',
    cyan:    'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20',
    pink:    'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-500/20',
    violet:  'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    sky:     'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-500/20',
    rose:    'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
    gray:    'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20',
  }

  return (
    <>
      {showAIModal && <SendToAIModal prompt={prompt} onClose={() => setShowAIModal(false)} />}
      {showRemixModal && <RemixModal prompt={prompt} onClose={() => setShowRemixModal(false)} />}

      <div className="group relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-orange-200 dark:hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-100/50 dark:hover:shadow-orange-900/10 transition-all duration-300 hover:-translate-y-1">

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/3 group-hover:to-amber-500/3 transition-all duration-300 pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">{config.emoji}</span>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">{prompt.title}</h3>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colorMap[config.color]}`}>
                {prompt.category}
              </span>
            </div>
          </div>
          <button
            onClick={onFavorite}
            className={`text-xl flex-shrink-0 transition-all duration-200 hover:scale-125 ${prompt.favorite ? 'text-orange-400 drop-shadow-sm' : 'text-gray-200 dark:text-gray-700 hover:text-orange-300'}`}
          >
            ★
          </button>
        </div>

        {/* Prompt preview */}
        <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed line-clamp-3 flex-1">
          {prompt.prompt}
        </p>

        {/* Tags */}
        {prompt.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 text-xs rounded-lg border border-gray-100 dark:border-zinc-700">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1 flex-wrap">
          <button
            onClick={onCopy}
            className="flex-1 py-2 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-zinc-700 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
          >
            Copy
          </button>
          <button
            onClick={() => setShowAIModal(true)}
            className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95"
          >
            🚀 Send to AI
          </button>
          <button
            onClick={() => setShowRemixModal(true)}
            className="flex-1 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95"
          >
            🔀 Remix
          </button>
          <button
            onClick={onAddToCollection}
            className="py-2 px-3 bg-gray-50 dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-gray-400 hover:text-orange-500 border border-gray-100 dark:border-zinc-700 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
            title="Add to collection"
          >
            📁
          </button>
          {!prompt.builtIn && (
            <button
              onClick={onDelete}
              className="py-2 px-3 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-400 border border-red-100 dark:border-red-500/20 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </>
  )
}