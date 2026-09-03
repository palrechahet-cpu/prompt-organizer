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

  const ariaId = prompt.id || prompt.title.replace(/\s+/g, '-')

  return (
    <>
      {showAIModal && <SendToAIModal prompt={prompt} onClose={() => setShowAIModal(false)} />}
      {showRemixModal && <RemixModal prompt={prompt} onClose={() => setShowRemixModal(false)} />}
      <HoverPreview prompt={prompt} accent={accent} visible={showPreview} position={previewPos} />

      <article
        ref={cardRef}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="article"
        tabIndex={0}
        aria-labelledby={`prompt-title-${ariaId}`}
        aria-describedby={`prompt-desc-${ariaId}`}
        className={`group relative bg-white dark:bg-[#0b0b0b] border border-gray-200 dark:border-white/8 rounded-xl h-28 cursor-pointer overflow-hidden transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400 ${expanded ? 'ring-2 ring-orange-400' : ''}`}
        style={{ minWidth: 280 }}
      >
        {/* Card content: compact productivity-focused layout */}
        <div className="flex items-start gap-3 px-4 py-3 h-full">
          {/* Icon */}
          <div className="flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center bg-white/0 text-lg" aria-hidden="true">
            <span role="img" aria-label={prompt.category || 'prompt category'} style={{ fontSize: 20 }}>{config.emoji}</span>
          </div>

          {/* Main column */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 id={`prompt-title-${ariaId}`} className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {prompt.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onFavorite && onFavorite() }}
                    className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
                    style={prompt.favorite ? { color: 'var(--color-primary)' } : { color: 'rgba(156,163,175,0.9)' }}
                    aria-label={prompt.favorite ? 'Unfavorite' : 'Favorite'}
                    aria-pressed={prompt.favorite ? 'true' : 'false'}
                  >
                    ★
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); /* TODO: open menu */ }}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600"
                    aria-label="More actions"
                  >
                    ⋯
                  </button>
                </div>
              </div>

              <p id={`prompt-desc-${ariaId}`} className={`text-gray-500 dark:text-gray-400 text-sm mt-1 leading-snug ${expanded ? '' : 'line-clamp-2'}`}>
                {prompt.prompt}
              </p>
            </div>

            {/* Metadata row */}
            <div className="flex items-center justify-between w-full mt-2">
              <div className="flex items-center gap-2 text-xs text-gray-400 truncate">
                <span className="hidden sm:inline">{prompt.category}</span>
                {prompt.tags && prompt.tags.length > 0 && (
                  <span className="hidden sm:inline">• {prompt.tags.slice(0,2).join(', ')}</span>
                )}
                {prompt.usageCount !== undefined && (
                  <span className="ml-1">• {prompt.usageCount} uses</span>
                )}
                {prompt.lastUsed && (
                  <span className="ml-1">• Last used {prompt.lastUsed}</span>
                )}
              </div>

              {/* Compact action buttons: reveal on hover/focus */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleCopy(e) }}
                  aria-label="Copy prompt"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-50 hover:bg-gray-100 text-gray-600"
                >
                  ⧉
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowAIModal(true) }}
                  aria-label="Run / Send prompt"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-50 hover:bg-gray-100 text-gray-600"
                >
                  ▶
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowRemixModal(true) }}
                  aria-label="Edit / Remix prompt"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-50 hover:bg-gray-100 text-gray-600"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAddToCollection && onAddToCollection() }}
                  aria-label="Add to collection"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-50 hover:bg-gray-100 text-gray-600"
                >
                  ＋
                </button>
                {!prompt.builtIn && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete && onDelete() }}
                    aria-label="Delete prompt"
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100"
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
