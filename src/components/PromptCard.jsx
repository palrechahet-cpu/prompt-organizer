import { useState } from 'react'
import RemixModal from './RemixModal'

function SendToAIModal({ prompt, onClose }) {
  const [editedPrompt, setEditedPrompt] = useState(prompt.prompt)

  const agents = [
    {
      name: 'ChatGPT',
      emoji: '🤖',
      color: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
      getUrl: (text) => `https://chatgpt.com/?q=${encodeURIComponent(text)}`
    },
    {
      name: 'Claude',
      emoji: '🧡',
      color: 'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
      getUrl: (text) => `https://claude.ai/new?q=${encodeURIComponent(text)}`
    },
    {
      name: 'Gemini',
      emoji: '✨',
      color: 'from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-lg p-7 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <span className="text-lg">🚀</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-base">Send to AI</h2>
              <p className="text-xs text-gray-400">{prompt.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-sm">✕</button>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Edit before sending</label>
          <textarea
            value={editedPrompt}
            onChange={e => setEditedPrompt(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition resize-none"
          />
          <p className="text-xs text-gray-400 mt-1.5">{editedPrompt.length} chars · Copied to clipboard on send</p>
        </div>
        <div className="flex flex-col gap-2">
          {agents.map(agent => (
            <button
              key={agent.name}
              onClick={() => handleSend(agent)}
              disabled={!editedPrompt.trim()}
              className={`w-full py-3 px-4 bg-gradient-to-r ${agent.color} text-white rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm`}
            >
              <span>{agent.emoji}</span>
              Open in {agent.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PromptCard({ prompt, onFavorite, onCopy, onDelete, onShare, onAddToCollection }) {
  const [showAIModal, setShowAIModal] = useState(false)
  const [showRemixModal, setShowRemixModal] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

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
    blue:    { badge: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', dot: 'bg-blue-400' },
    purple:  { badge: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400', dot: 'bg-purple-400' },
    orange:  { badge: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400', dot: 'bg-orange-400' },
    green:   { badge: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400', dot: 'bg-green-400' },
    cyan:    { badge: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', dot: 'bg-cyan-400' },
    pink:    { badge: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400', dot: 'bg-pink-400' },
    violet:  { badge: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400', dot: 'bg-violet-400' },
    emerald: { badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-400' },
    sky:     { badge: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400', dot: 'bg-sky-400' },
    rose:    { badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400', dot: 'bg-rose-400' },
    gray:    { badge: 'bg-gray-50 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' },
  }

  const colors = colorMap[config.color] || colorMap.gray

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {showAIModal && <SendToAIModal prompt={prompt} onClose={() => setShowAIModal(false)} />}
      {showRemixModal && <RemixModal prompt={prompt} onClose={() => setShowRemixModal(false)} />}

      <div
        className={`group relative bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.07] rounded-2xl flex flex-col transition-all duration-300 cursor-pointer
          ${expanded
            ? 'shadow-2xl shadow-orange-100/60 dark:shadow-black/40 border-orange-200 dark:border-orange-500/20'
            : 'hover:border-gray-200 dark:hover:border-white/15 hover:shadow-lg hover:shadow-gray-100/80 dark:hover:shadow-black/30 hover:-translate-y-0.5'
          }`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Top accent line */}
        <div className={`h-0.5 w-full rounded-t-2xl bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-orange-300/40 dark:group-hover:via-orange-500/20 transition-all duration-500 ${expanded ? 'via-orange-400/60 dark:via-orange-500/30' : ''}`} />

        <div className="p-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${colors.badge}`}>
                {config.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{prompt.title}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  <span className="text-xs text-gray-400 dark:text-gray-500">{prompt.category}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onFavorite() }}
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 ${prompt.favorite ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700 hover:text-amber-300'}`}
              >
                ★
              </button>
              <div className={`w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 transition-all duration-200 ${expanded ? 'rotate-180' : ''}`}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Prompt text */}
          <p className={`text-gray-500 dark:text-gray-400 text-xs leading-relaxed transition-all duration-300 ${expanded ? '' : 'line-clamp-3'}`}>
            {prompt.prompt}
          </p>

          {/* Tags */}
          {prompt.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {prompt.tags.slice(0, expanded ? undefined : 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 text-xs rounded-lg border border-gray-100 dark:border-white/5">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions — always visible but cleaner */}
          <div
            className="flex gap-2 pt-1 border-t border-gray-50 dark:border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCopy}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${copied ? 'bg-green-500 text-white' : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button
              onClick={() => setShowAIModal(true)}
              className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
            >
              🚀 Send
            </button>
            <button
              onClick={() => setShowRemixModal(true)}
              className="flex-1 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
            >
              🔀 Remix
            </button>
            <button
              onClick={onAddToCollection}
              className="w-8 py-2 flex items-center justify-center bg-gray-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-gray-400 hover:text-orange-500 rounded-xl text-xs transition-all duration-200 active:scale-95"
              title="Add to collection"
            >
              📁
            </button>
            {!prompt.builtIn && (
              <button
                onClick={onDelete}
                className="w-8 py-2 flex items-center justify-center bg-gray-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-300 dark:text-gray-600 hover:text-red-400 rounded-xl text-xs transition-all duration-200 active:scale-95"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}