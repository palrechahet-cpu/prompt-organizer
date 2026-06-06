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
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/8 rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-base">Send to AI</h2>
            <p className="text-xs text-gray-400 mt-0.5">{prompt.title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-xs">✕</button>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 block">Edit before sending</label>
          <textarea
            value={editedPrompt}
            onChange={e => setEditedPrompt(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition resize-none"
            style={{ '--tw-ring-color': 'var(--color-primary)' }}
          />
          <p className="text-xs text-gray-400 mt-1.5">{editedPrompt.length} chars · Copied to clipboard on send</p>
        </div>
        <div className="flex flex-col gap-2">
          {agents.map(agent => (
            <button
              key={agent.name}
              onClick={() => handleSend(agent)}
              disabled={!editedPrompt.trim()}
              className={`w-full py-2.5 px-4 bg-gradient-to-r ${agent.color} text-white rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed`}
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

const ACCENT_COLORS = {
  blue:    { cls: 'bg-blue-500',    hex: '#3b82f6' },
  purple:  { cls: 'bg-purple-500',  hex: '#8b5cf6' },
  orange:  { cls: 'bg-orange-500',  hex: '#f97316' },
  green:   { cls: 'bg-green-500',   hex: '#22c55e' },
  cyan:    { cls: 'bg-cyan-500',    hex: '#06b6d4' },
  pink:    { cls: 'bg-pink-500',    hex: '#ec4899' },
  violet:  { cls: 'bg-violet-500',  hex: '#8b5cf6' },
  emerald: { cls: 'bg-emerald-500', hex: '#10b981' },
  sky:     { cls: 'bg-sky-500',     hex: '#0ea5e9' },
  rose:    { cls: 'bg-rose-500',    hex: '#f43f5e' },
  gray:    { cls: 'bg-gray-400',    hex: '#9ca3af' },
}

const CATEGORY_CONFIG = {
  Research:           { color: 'blue',    emoji: '📚' },
  Writing:            { color: 'purple',  emoji: '✍️'  },
  AI:                 { color: 'orange',  emoji: '🤖' },
  Productivity:       { color: 'green',   emoji: '⚡' },
  Education:          { color: 'cyan',    emoji: '🎓' },
  Psychology:         { color: 'pink',    emoji: '🧠' },
  Creative:           { color: 'violet',  emoji: '🎨' },
  'Health & Fitness': { color: 'emerald', emoji: '💪' },
  'Tech & Coding':    { color: 'sky',     emoji: '💻' },
  'Social Media':     { color: 'rose',    emoji: '📱' },
}

export default function PromptCard({ prompt, onFavorite, onCopy, onDelete, onShare, onAddToCollection }) {
  const [showAIModal, setShowAIModal] = useState(false)
  const [showRemixModal, setShowRemixModal] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const config = CATEGORY_CONFIG[prompt.category] || { color: 'gray', emoji: '📌' }
  const accent = ACCENT_COLORS[config.color] || ACCENT_COLORS.gray

  const handleCopy = (e) => {
    e.stopPropagation()
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {showAIModal && <SendToAIModal prompt={prompt} onClose={() => setShowAIModal(false)} />}
      {showRemixModal && <RemixModal prompt={prompt} onClose={() => setShowRemixModal(false)} />}

      <div
        onClick={() => setExpanded(!expanded)}
        className={`group relative bg-white dark:bg-[#111] rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col
          ${expanded
            ? 'shadow-xl'
            : 'border-gray-100 dark:border-white/6 hover:border-gray-200 dark:hover:border-white/12 hover:shadow-md hover:shadow-gray-100/80 dark:hover:shadow-black/40 hover:-translate-y-0.5'
          }`}
        style={expanded ? {
          borderColor: 'var(--color-primary)',
          boxShadow: `0 20px 40px -12px color-mix(in srgb, var(--color-primary) 15%, transparent)`
        } : {}}
      >
        {/* Left accent bar — per category color */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-[3px] ${accent.cls} transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`}
        />

        <div className="pl-5 pr-4 pt-4 pb-4 flex flex-col gap-3">

          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white/90 text-sm leading-snug truncate pr-2">
                {prompt.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-1 h-1 rounded-full ${accent.cls} opacity-70`} />
                <span className="text-xs text-gray-400 dark:text-gray-500">{prompt.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
              <button
                onClick={(e) => { e.stopPropagation(); onFavorite() }}
                className="w-6 h-6 flex items-center justify-center rounded-md transition-all duration-150 text-sm hover:scale-110"
                style={prompt.favorite ? { color: 'var(--color-primary)' } : { color: 'rgba(156,163,175,0.3)' }}
              >
                ★
              </button>
              <div className={`w-5 h-5 flex items-center justify-center text-gray-300 dark:text-white/20 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Prompt text */}
          <p className={`text-gray-400 dark:text-gray-500 text-xs leading-relaxed transition-all duration-300 ${expanded ? '' : 'line-clamp-3'}`}>
            {prompt.prompt}
          </p>

          {/* Tags */}
          {prompt.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {prompt.tags.slice(0, expanded ? undefined : 3).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 text-gray-400 dark:text-gray-600 text-xs rounded-md border border-gray-100 dark:border-white/6">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-50 dark:border-white/5" />

          {/* Action buttons */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 ${
                copied
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8 border border-gray-100 dark:border-white/6'
              }`}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>

            {/* Send to AI */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowAIModal(true) }}
              className="flex-1 py-1.5 text-white rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              🚀 Send
            </button>

            {/* Remix */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowRemixModal(true) }}
              className="flex-1 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-xs font-medium transition-all duration-150 active:scale-95"
            >
              🔀 Remix
            </button>

            {/* Collection */}
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCollection() }}
              title="Add to collection"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5 text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-white/6 transition-all duration-150 active:scale-95 text-xs hover:text-white"
              style={{ '--hover-bg': 'var(--color-primary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
            >
              📁
            </button>

            {/* Delete */}
            {!prompt.builtIn && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/8 text-gray-300 dark:text-gray-600 hover:text-red-400 border border-gray-100 dark:border-white/6 transition-all duration-150 active:scale-95 text-xs"
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