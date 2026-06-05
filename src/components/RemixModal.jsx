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

export default function RemixModal({ prompt, onClose }) {
  const [topic, setTopic] = useState('')
  const [instructions, setInstructions] = useState('')
  const [remixedPrompt, setRemixedPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showAgents, setShowAgents] = useState(false)

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  const handleRemix = async () => {
    if (!instructions.trim() && !topic.trim()) {
      setError('Please enter a topic or modification instructions.')
      return
    }
    setLoading(true)
    setError('')
    setRemixedPrompt('')

    try {
      const systemPrompt = `You are an expert prompt engineer. Your job is to improve and customize AI prompts.
When given a prompt, you will:
1. Replace any placeholder text like [Insert topic here], [Insert X here], [Paste X here] with the user's specified topic if provided
2. Modify the prompt according to the user's instructions
3. Return ONLY the improved prompt text, nothing else — no explanations, no preamble, no quotes`

      const userMessage = `Original prompt:
${prompt.prompt}

${topic.trim() ? `Topic to insert: ${topic.trim()}` : ''}
${instructions.trim() ? `Modification instructions: ${instructions.trim()}` : ''}

Return only the improved prompt.`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }]
        })
      })

      const data = await response.json()
      const text = data.content?.map(b => b.text || '').join('') || ''
      if (!text) throw new Error('No response received')
      setRemixedPrompt(text.trim())
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔀</span>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Prompt Remixer</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">AI-powered prompt customization</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl transition-colors">✕</button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
              Topic <span className="normal-case font-normal text-gray-400">(replaces [Insert topic here] placeholders)</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. climate change, React hooks, email marketing..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
              Modifications <span className="normal-case font-normal text-gray-400">(how to improve the prompt)</span>
            </label>
            <input
              type="text"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="e.g. make it shorter, add more examples, make it for beginners..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>
          <button
            onClick={handleRemix}
            disabled={loading || (!topic.trim() && !instructions.trim())}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                Remixing...
              </>
            ) : (
              <>🔀 Remix Prompt</>
            )}
          </button>
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        </div>

        {/* Side by side */}
        {(remixedPrompt || loading) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Original */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Original</span>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed h-64 overflow-y-auto">
                {prompt.prompt}
              </div>
            </div>

            {/* Remixed */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-orange-500">Remixed ✨</span>
              </div>
              <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/20 rounded-xl p-4 text-xs text-gray-700 dark:text-gray-300 leading-relaxed h-64 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full gap-2 text-orange-400">
                    <span className="animate-spin text-lg">⚙️</span>
                    <span>AI is remixing...</span>
                  </div>
                ) : remixedPrompt}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {remixedPrompt && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${copied ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}
              >
                {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
              </button>
              <button
                onClick={() => setShowAgents(!showAgents)}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-lg active:scale-95"
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
                    className={`w-full py-2.5 px-4 bg-gradient-to-r ${agent.color} text-white rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2`}
                  >
                    <span>{agent.emoji}</span>
                    Open in {agent.name}
                    <span className="text-xs opacity-70 ml-1">(also copies to clipboard)</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}