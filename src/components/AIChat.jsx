import { useState, useEffect, useRef } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function AIChat({ user, allPrompts, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [savedApiKey, setSavedApiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [showPromptPicker, setShowPromptPicker] = useState(false)
  const [promptSearch, setPromptSearch] = useState('')
  const [savingKey, setSavingKey] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const loadApiKey = async () => {
      if (!user) return
      const ref = doc(db, 'users', user.uid, 'settings', 'apikey')
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setSavedApiKey(snap.data().key || '')
      } else {
        setShowKeyInput(true)
      }
    }
    loadApiKey()
  }, [user])

  const saveApiKey = async () => {
    if (!apiKey.trim()) return
    setSavingKey(true)
    const ref = doc(db, 'users', user.uid, 'settings', 'apikey')
    await setDoc(ref, { key: apiKey.trim() })
    setSavedApiKey(apiKey.trim())
    setApiKey('')
    setShowKeyInput(false)
    setSavingKey(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const key = savedApiKey
    if (!key) { setShowKeyInput(true); return }

    const userMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a helpful AI assistant inside a prompt management app called AI Prompt Studio. Help users craft, improve, and use AI prompts effectively. Be concise, practical, and specific.',
          messages: newMessages
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error.message)
      const assistantMessage = {
        role: 'assistant',
        content: data.content?.map(b => b.text || '').join('') || 'Sorry, I could not generate a response.'
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${err.message}. Please check your API key in settings.`
      }])
    } finally {
      setLoading(false)
    }
  }

  const usePrompt = (prompt) => {
    setInput(prompt.prompt)
    setShowPromptPicker(false)
    setPromptSearch('')
  }

  const filteredPrompts = allPrompts.filter(p =>
    p.title.toLowerCase().includes(promptSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(promptSearch.toLowerCase())
  ).slice(0, 20)

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/8 rounded-2xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: 'var(--color-primary)' }}>✦</div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm">AI Assistant</h2>
              <p className="text-xs text-gray-400">Powered by Claude</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              {savedApiKey ? '🔑 API Key ✓' : '🔑 Add API Key'}
            </button>
            <button
              onClick={() => setMessages([])}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              Clear
            </button>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-xs">✕</button>
          </div>
        </div>

        {/* API Key Input */}
        {showKeyInput && (
          <div className="px-5 py-3 bg-amber-50 dark:bg-amber-500/5 border-b border-amber-100 dark:border-amber-500/10 flex-shrink-0">
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2 font-medium">
              🔑 Enter your Anthropic API key — get one free at <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="underline">console.anthropic.com</a>
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveApiKey()}
                placeholder="sk-ant-..."
                className="flex-1 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-500/20 bg-white dark:bg-white/5 text-gray-900 dark:text-gray-100 text-xs focus:outline-none focus:ring-2 transition"
                style={{ '--tw-ring-color': 'var(--color-primary)' }}
              />
              <button
                onClick={saveApiKey}
                disabled={savingKey || !apiKey.trim()}
                className="px-4 py-2 text-white rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {savingKey ? 'Saving...' : 'Save'}
              </button>
              {savedApiKey && (
                <button onClick={() => setShowKeyInput(false)} className="px-3 py-2 bg-gray-100 dark:bg-white/6 text-gray-500 rounded-lg text-xs">Cancel</button>
              )}
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1.5">Your key is stored securely in your account and never shared.</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
                ✦
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">AI Prompt Assistant</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Ask me to help craft, improve, or customize any prompt. Or pick one from your library below.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Help me write a better prompt', 'Explain how to use prompts effectively', 'What prompts work best for coding?'].map(s => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-white/8 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20 transition-colors bg-white dark:bg-white/4"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/6 rounded-bl-sm'
              }`}
                style={msg.role === 'user' ? { backgroundColor: 'var(--color-primary)' } : {}}
              >
                <p className="whitespace-pre-wrap text-xs">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/6">
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-primary)', animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-primary)', animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-primary)', animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Picker */}
        {showPromptPicker && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-white/6 bg-gray-50 dark:bg-white/3 flex-shrink-0 max-h-48 overflow-y-auto">
            <input
              type="text"
              value={promptSearch}
              onChange={e => setPromptSearch(e.target.value)}
              placeholder="Search prompts..."
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/8 bg-white dark:bg-white/5 text-gray-900 dark:text-gray-100 text-xs focus:outline-none mb-2 transition"
            />
            <div className="flex flex-col gap-1">
              {filteredPrompts.map(p => (
                <button
                  key={p.id}
                  onClick={() => usePrompt(p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-white/8 text-left transition-colors"
                >
                  <span className="text-xs font-medium text-gray-900 dark:text-white truncate flex-1">{p.title}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{p.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/6 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <button
              onClick={() => setShowPromptPicker(!showPromptPicker)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/8 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-sm mb-0.5"
              title="Use a prompt from library"
            >
              📚
            </button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder={savedApiKey ? "Ask anything... (Enter to send, Shift+Enter for new line)" : "Add your API key to start chatting"}
              rows={1}
              disabled={!savedApiKey}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-xs focus:outline-none focus:ring-2 transition resize-none disabled:opacity-50"
              style={{ '--tw-ring-color': 'var(--color-primary)', minHeight: '40px', maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim() || !savedApiKey}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-white transition-all active:scale-95 disabled:opacity-40 mb-0.5"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              ↑
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1.5 text-center">
            Uses your personal Anthropic API key · <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="underline hover:text-gray-600">Get one free</a>
          </p>
        </div>
      </div>
    </div>
  )
}