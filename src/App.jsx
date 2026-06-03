import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturedSection from './components/FeaturedSection'
import CategoriesSection from './components/CategoriesSection'
import AddPromptForm from './components/AddPromptForm'
import PromptCard from './components/PromptCard'
import Footer from './components/Footer'
import Toast from './components/Toast'
import LoginPage from './components/LoginPage'
import defaultPrompts from './data/prompts'

function ShareModal({ prompt, onClose }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = (() => {
    const encoded = btoa(encodeURIComponent(JSON.stringify({ title: prompt.title, category: prompt.category, prompt: prompt.prompt, tags: prompt.tags })))
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('share', encoded)
    return url.toString()
  })()
  const copyLink = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="text-xl">🔗</span><h2 className="font-bold text-gray-900 dark:text-white text-lg">Share Prompt</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none transition-colors">✕</button>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 border border-gray-100 dark:border-zinc-700">
          <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{prompt.title}</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2">{prompt.prompt}</p>
        </div>
        <div className="flex gap-2 items-center">
          <input readOnly value={shareUrl} className="flex-1 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-gray-500 dark:text-gray-400 truncate focus:outline-none" />
          <button onClick={copyLink} className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${copied ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm'}`}>{copied ? '✓ Copied!' : 'Copy Link'}</button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">Anyone with this link can view and import this prompt.</p>
      </div>
    </div>
  )
}

function SharedPromptModal({ prompt, onImport, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2"><span className="text-2xl">🎁</span><h2 className="font-bold text-gray-900 dark:text-white text-lg">Shared Prompt</h2></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Someone shared this prompt with you. Add it to your library?</p>
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 border border-gray-100 dark:border-zinc-700 flex flex-col gap-2">
          <p className="font-semibold text-gray-800 dark:text-white text-sm">{prompt.title}</p>
          <span className="text-xs text-orange-500 font-medium">{prompt.category}</span>
          <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed line-clamp-4">{prompt.prompt}</p>
          {prompt.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {prompt.tags.map(tag => (<span key={tag} className="px-2 py-0.5 bg-white dark:bg-zinc-700 text-gray-400 text-xs rounded-lg border border-gray-100 dark:border-zinc-600">#{tag}</span>))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onImport} className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95">Add to My Library</button>
          <button onClick={onClose} className="py-2.5 px-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95">Dismiss</button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => { return localStorage.getItem('darkMode') !== 'false' })
  const [prompts, setPrompts] = useState(() => {
    try {
      const saved = localStorage.getItem('prompts')
      const parsed = saved ? JSON.parse(saved) : defaultPrompts
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultPrompts
    } catch {
      return defaultPrompts
    }
  })
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [toast, setToast] = useState(null)
  const [sharePrompt, setSharePrompt] = useState(null)
  const [incomingSharedPrompt, setIncomingSharedPrompt] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shared = params.get('share')
    if (shared) { try { const decoded = JSON.parse(decodeURIComponent(atob(shared))); setIncomingSharedPrompt(decoded) } catch { } }
  }, [])

  useEffect(() => { localStorage.setItem('prompts', JSON.stringify(prompts)) }, [prompts])
  useEffect(() => { localStorage.setItem('darkMode', darkMode); document.documentElement.classList.toggle('dark', darkMode) }, [darkMode])

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 2500) }
  const toggleFavorite = (id) => { setPrompts(prev => prev.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p)) }
  const copyPrompt = (text) => { navigator.clipboard.writeText(text); showToast('Prompt copied!') }
  const addPrompt = (newPrompt) => { setPrompts(prev => [...prev, { ...newPrompt, id: Date.now(), favorite: false }]); showToast('Prompt added!') }
  const deletePrompt = (id) => { setPrompts(prev => prev.filter(p => p.id !== id)); showToast('Prompt deleted!') }

  const importSharedPrompt = () => {
    if (!incomingSharedPrompt) return
    addPrompt(incomingSharedPrompt)
    setIncomingSharedPrompt(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('share')
    window.history.replaceState({}, '', url.toString())
  }

  const dismissSharedPrompt = () => {
    setIncomingSharedPrompt(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('share')
    window.history.replaceState({}, '', url.toString())
  }

  const categories = ['All', ...new Set(prompts.map(p => p.category))]
  const filtered = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())) || p.prompt?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesFav = !showFavoritesOnly || p.favorite
    return matchesSearch && matchesCategory && matchesFav
  })

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-bounce">🎯</span>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
        <Navbar
          search={search}
          setSearch={setSearch}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          user={user}
          onSignOut={() => signOut(auth)}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <HeroSection promptCount={prompts.length} />
          <FeaturedSection prompts={prompts} onCopy={copyPrompt} onFavorite={toggleFavorite} onDelete={deletePrompt} onShare={(p) => setSharePrompt(p)} />
          <CategoriesSection categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <AddPromptForm onAdd={addPrompt} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400 dark:text-gray-600">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-lg font-medium">No prompts found</p>
                <p className="text-sm">Try a different search or category</p>
              </div>
            ) : (
              filtered.map(p => (
                <PromptCard key={p.id} prompt={p} onFavorite={() => toggleFavorite(p.id)} onCopy={() => copyPrompt(p.prompt)} onDelete={() => deletePrompt(p.id)} onShare={() => setSharePrompt(p)} />
              ))
            )}
          </div>
        </main>
        <Footer />
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        {sharePrompt && <ShareModal prompt={sharePrompt} onClose={() => setSharePrompt(null)} />}
        {incomingSharedPrompt && <SharedPromptModal prompt={incomingSharedPrompt} onImport={importSharedPrompt} onClose={dismissSharedPrompt} />}
      </div>
    </div>
  )
}

export default App
