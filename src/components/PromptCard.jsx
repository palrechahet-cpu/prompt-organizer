import { useState, useRef, useEffect } from 'react'
import RemixModal from './RemixModal'

function SendToAIModal({ prompt, onClose }) {
  const [editedPrompt, setEditedPrompt] = useState(prompt?.prompt || '')

  const agents = [
    { name: 'ChatGPT', emoji: '🤖', color: 'from-green-500 to-emerald-500', getUrl: t => `https://chatgpt.com/?q=${encodeURIComponent(t)}` },
    { name: 'Claude', emoji: '🧡', color: 'from-orange-500 to-amber-500', getUrl: t => `https://claude.ai/new?q=${encodeURIComponent(t)}` },
    { name: 'Gemini', emoji: '✨', color: 'from-blue-500 to-violet-500', getUrl: t => `https://gemini.google.com/app?q=${encodeURIComponent(t)}` },
  ]

  const handleSend = (agent) => {
    navigator.clipboard.writeText(editedPrompt)
    window.open(agent.getUrl(editedPrompt), '_blank')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/8 rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Send to AI</h2>
            <p className="text-xs text-gray-400 mt-0.5">{prompt?.title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500">✕</button>
        </div>

        <textarea value={editedPrompt} onChange={e => setEditedPrompt(e.target.value)} rows={6} className="w-full px-3 py-2 rounded-md border" />

        <div className="mt-3 flex flex-col gap-2">
          {agents.map(a => (
            <button key={a.name} onClick={() => handleSend(a)} disabled={!editedPrompt.trim()} className={`w-full py-2 rounded-xl text-white bg-gradient-to-r ${a.color}`}>
              <span className="mr-2">{a.emoji}</span>
              Open in {a.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function HoverPreview({ prompt, accent, visible, position }) {
  if (!visible) return null
  return (
    <div
      className="fixed z-[100] w-80 bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 pointer-events-none"
      style={{
        top: position.y,
        left: position.x,
        boxShadow: `0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px color-mix(in srgb, var(--color-primary) 15%, transparent)`
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className={`w-1 h-full min-h-[40px] rounded-full ${accent.cls} flex-shrink-0 opacity-80`} />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{prompt.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs" style={{ color: 'var(--color-primary)' }}>{prompt.category}</span>
            {prompt.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs text-gray-400 dark:text-gray-600">#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Full prompt text */}
      <div className="bg-gray-50 dark:bg-white/4 rounded-xl p-3 border border-gray-100 dark:border-white/6 max-h-48 overflow-y-auto">
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{prompt.prompt}</p>
      </div>

      {/* Footer hint */}
      <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
        Click to expand · Copy to use
      </p>
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

export default function PromptCard({ prompt, onFavorite, onCopy, onDelete, onShare, onAddToCollection, selectable = false, selected = false, onToggleSelect }) {
  const [showAIModal, setShowAIModal] = useState(false)
  const [showRemixModal, setShowRemixModal] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 })
  const hoverTimer = useRef(null)
  const cardRef = useRef(null)

  const config = CATEGORY_CONFIG[prompt.category] || { color: 'gray', emoji: '📌' }
  const accent = ACCENT_COLORS[config.color] || ACCENT_COLORS.gray

  const handleCopy = (e) => {
    e.stopPropagation()
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const smallIconClass = 'h-3.5 w-3.5'

  const handleMouseEnter = () => {
    if (expanded) return
    hoverTimer.current = setTimeout(() => {
      const rect = cardRef.current?.getBoundingClientRect()
      if (!rect) return
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const previewWidth = 320
      const previewHeight = 280

      let x = rect.right + 12
      let y = rect.top

      // Flip left if not enough space on right
      if (x + previewWidth > viewportWidth - 16) {
        x = rect.left - previewWidth - 12
      }

      // Flip up if not enough space below
      if (y + previewHeight > viewportHeight - 16) {
        y = viewportHeight - previewHeight - 16
      }

      // Keep on screen
      x = Math.max(16, x)
      y = Math.max(16, y)

      setPreviewPos({ x, y })
      setShowPreview(true)
    }, 600)
  }

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current)
    setShowPreview(false)
  }

  useEffect(() => {
    return () => clearTimeout(hoverTimer.current)
  }, [])

  return (
    <>
      {showAIModal && <SendToAIModal prompt={prompt} onClose={() => setShowAIModal(false)} />}
      {showRemixModal && <RemixModal prompt={prompt} onClose={() => setShowRemixModal(false)} />}
      <HoverPreview prompt={prompt} accent={accent} visible={showPreview} position={previewPos} />

      <div
        ref={cardRef}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
        {/* Left accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${accent.cls} transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`} />

        <div className="pl-5 pr-4 pt-4 pb-4 flex flex-col gap-3">
          {selectable && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleSelect && onToggleSelect() }}
              className={`absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold ${selected ? 'bg-orange-500 text-white border-orange-500' : 'bg-white/80 dark:bg-zinc-900/80 text-gray-400 border-gray-200 dark:border-zinc-700'}`}
              aria-label={`Select ${prompt.title}`}
              aria-pressed={selected ? 'true' : 'false'}
            >
              {selected ? '✓' : ''}
            </button>
          )}

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
                type="button"
                onClick={(e) => { e.stopPropagation(); onFavorite() }}
                className="w-6 h-6 flex items-center justify-center rounded-md transition-all duration-150 text-sm hover:scale-110"
                style={prompt.favorite ? { color: 'var(--color-primary)' } : { color: 'rgba(156,163,175,0.3)' }}
                aria-label={prompt.favorite ? 'Unfavorite' : 'Favorite'}
                aria-pressed={prompt.favorite ? 'true' : 'false'}
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
            <button
              type="button"
              onClick={handleCopy}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-all duration-150 active:scale-95 ${
                copied
                  ? 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-white/6 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/8'
              }`}
              aria-label="Copy prompt to clipboard"
            >
              <span className="flex items-center justify-center gap-1.5">
                {copied ? '✓' : '⧉'}
                {copied ? 'Copied' : 'Copy'}
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowAIModal(true) }}
              className="flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-white transition-all duration-150 active:scale-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
              aria-label="Send prompt to AI"
            >
              <span className="flex items-center justify-center gap-1.5">
                <svg viewBox="0 0 20 20" fill="none" className={smallIconClass} aria-hidden="true"><path d="M5 12L9.5 7.5L12 10L15.5 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 6.5H15.5V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Send
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowRemixModal(true) }}
              className="flex-1 rounded-lg bg-violet-500 px-2 py-1.5 text-[11px] font-medium text-white transition-all duration-150 hover:bg-violet-600 active:scale-95"
              aria-label="Remix prompt"
            >
              <span className="flex items-center justify-center gap-1.5">
                <svg viewBox="0 0 20 20" fill="none" className={smallIconClass} aria-hidden="true"><path d="M6 7.5H13.5C15 7.5 16.2 8.7 16.2 10.2C16.2 11.7 15 12.9 13.5 12.9H9.5M6 7.5L8.5 5M6 7.5L8.5 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 12.5H6.5C5 12.5 3.8 11.3 3.8 9.8C3.8 8.3 5 7.1 6.5 7.1H10.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Remix
              </span>
            </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onShare && onShare(prompt) }}
                title="Share"
                aria-label="Share prompt"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-500 ring-1 ring-gray-100 transition-all duration-150 hover:text-orange-500 dark:bg-white/5 dark:text-gray-300 dark:ring-white/6"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true"><path d="M14 7A2 2 0 1 1 14 3A2 2 0 0 1 14 7ZM6 12A2 2 0 1 1 6 8A2 2 0 0 1 6 12ZM14 17A2 2 0 1 1 14 13A2 2 0 0 1 14 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M8.2 11.3L12 8.8M8.2 8.7L12 11.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCollection() }}
              title="Add to collection"
              aria-label="Add prompt to collection"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-500 ring-1 ring-gray-100 transition-all duration-150 hover:text-orange-500 dark:bg-white/5 dark:text-gray-300 dark:ring-white/6"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true"><path d="M3.5 6.5C3.5 5.7 4.1 5 4.9 5H8L9.3 6.3H15.1C15.9 6.3 16.5 7 16.5 7.8V13.5C16.5 14.3 15.9 15 15.1 15H4.9C4.1 15 3.5 14.3 3.5 13.5V6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </button>
            {!prompt.builtIn && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                aria-label="Delete prompt"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500 ring-1 ring-red-100 transition-all duration-150 hover:bg-red-100 dark:bg-red-500/8 dark:text-red-300 dark:ring-red-500/10"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true"><path d="M6 5.5V4.7C6 3.8 6.8 3 7.7 3H12.3C13.2 3 14 3.8 14 4.7V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M4 5.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M6.5 8V14.2C6.5 15.1 7.2 15.8 8.1 15.8H11.9C12.8 15.8 13.5 15.1 13.5 14.2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}