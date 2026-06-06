import { useState } from 'react'

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

function buildRemixedPrompt(original, topic, instructions) {
  let result = original

  // Replace all placeholder patterns with the topic
  if (topic.trim()) {
    result = result
      .replace(/\[Insert.*?here\]/gi, topic.trim())
      .replace(/\[Paste.*?here\]/gi, topic.trim())
      .replace(/\[Add.*?here\]/gi, topic.trim())
      .replace(/\[Your.*?here\]/gi, topic.trim())
      .replace(/\[Describe.*?\]/gi, topic.trim())
      .replace(/\[.*?topic.*?\]/gi, topic.trim())
      .replace(/\[.*?input.*?\]/gi, topic.trim())
  }

  // Append modification instructions as a note at the end
  if (instructions.trim()) {
    result = result + `\n\n---\nAdditional instructions: ${instructions.trim()}`
  }

  return result
}

export default function RemixModal({ prompt, onClose }) {
  const [topic, setTopic] = useState('')
  const [instructions, setInstructions] = useState('')
  const [remixedPrompt, setRemixedPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [showAgents, setShowAgents] = useState(false)

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  const handleRemix = () => {
    if (!topic.trim() && !instructions.trim()) return
    const result = buildRemixedPrompt(prompt.prompt, topic, instructions)
    setRemixedPrompt(result)
    setShowAgents(false)
    setCopied(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(remixedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendToAI = (agent) => {
    navigator.clipboard.writeText(remixedPrompt)
    window.open(agent.getUrl(remixedPrompt), '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
              🔀 Prompt Remixer
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{prompt.title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-xs">✕</button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 block">
              Topic <span className="normal-case font-normal">— replaces [Insert topic here] placeholders</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. climate change, React hooks, email marketing..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition"
              style={{ '--tw-ring-color': 'var(--color-primary)' }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 block">
              Modifications <span className="normal-case font-normal">— added as instructions for the AI</span>
            </label>
            <input
              type="text"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="e.g. make it shorter, add more examples, simplify for beginners..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition"
              style={{ '--tw-ring-color': 'var(--color-primary)' }}
              onKeyDown={e => e.key === 'Enter' && handleRemix()}
            />
          </div>
          <button
            onClick={handleRemix}
            disabled={!topic.trim() && !instructions.trim()}
            className="w-full py-2.5 text-white rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            🔀 Build Remixed Prompt
          </button>
        </div>

        {/* Side by side */}
        {remixedPrompt && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Original</span>
                <div className="bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/6 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed h-56 overflow-y-auto">
                  {prompt.prompt}
                </div>
              </div>

              {/* Remixed */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                  Remixed ✨
                </span>
                <textarea
                  value={remixedPrompt}
                  onChange={e => setRemixedPrompt(e.target.value)}
                  className="bg-gray-50 dark:bg-white/4 border rounded-xl p-4 text-xs text-gray-700 dark:text-gray-300 leading-relaxed h-56 resize-none focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: 'var(--color-primary)',
                    '--tw-ring-color': 'var(--color-primary)'
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-white/6 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                  }`}
                >
                  {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                </button>
                <button
                  onClick={() => setShowAgents(!showAgents)}
                  className="flex-1 py-2.5 text-white rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  🚀 Send to AI
                </button>
              </div>

              {/* AI Agent picker */}
              {showAgents && (
                <div className="flex flex-col gap-2">
                  {agents.map(agent => (
                    <button
                      key={agent.name}
                      onClick={() => handleSendToAI(agent)}
                      className={`w-full py-2.5 px-4 bg-gradient-to-r ${agent.color} text-white rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2`}
                    >
                      <span>{agent.emoji}</span>
                      Open in {agent.name}
                      <span className="text-xs opacity-60 ml-1">(also copies to clipboard)</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}