import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from './firebase'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturedSection from './components/FeaturedSection'
import CategoriesSection from './components/CategoriesSection'
import AddPromptForm from './components/AddPromptForm'
import PromptCard from './components/PromptCard'
import CollectionsSidebar from './components/CollectionsSidebar'
import AddToCollectionModal from './components/AddToCollectionModal'
import Footer from './components/Footer'
import Toast from './components/Toast'
import LoginPage from './components/LoginPage'
import OnboardingTour from './components/OnboardingTour'
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

function AddCategoryModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">New Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && (onAdd(name.trim()), onClose())}
          placeholder="e.g. Client Work, Personal, Side Projects"
          autoFocus
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex gap-2">
          <button onClick={() => { if (name.trim()) { onAdd(name.trim()); onClose() } }} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-sm active:scale-95">Create Category</button>
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded-xl font-bold text-sm active:scale-95">Cancel</button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showTour, setShowTour] = useState(() => !localStorage.getItem('tourDone'))
  const [userPrompts, setUserPrompts] = useState([])
  const [favorites, setFavorites] = useState({})
  const [collections, setCollections] = useState([])
  const [userCategories, setUserCategories] = useState([])
  const [activeCollection, setActiveCollection] = useState(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') !== 'false')
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'orange')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [toast, setToast] = useState(null)
  const [sharePrompt, setSharePrompt] = useState(null)
  const [incomingSharedPrompt, setIncomingSharedPrompt] = useState(null)
  const [collectionModalPrompt, setCollectionModalPrompt] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)

  // Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Load user prompts
  useEffect(() => {
    if (!user) { setUserPrompts([]); return }
    const ref = collection(db, 'users', user.uid, 'prompts')
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
      setUserPrompts(loaded)
    })
    return () => unsubscribe()
  }, [user])

  // Load favorites for built-in prompts
  useEffect(() => {
    if (!user) { setFavorites({}); return }
    const ref = collection(db, 'users', user.uid, 'favorites')
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const favMap = {}
      snapshot.docs.forEach(d => { favMap[d.data().promptId] = true })
      setFavorites(favMap)
    })
    return () => unsubscribe()
  }, [user])

  // Load collections
  useEffect(() => {
    if (!user) { setCollections([]); return }
    const ref = collection(db, 'users', user.uid, 'collections')
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
      setCollections(loaded)
    })
    return () => unsubscribe()
  }, [user])

  // Load user categories
  useEffect(() => {
    if (!user) { setUserCategories([]); return }
    const ref = collection(db, 'users', user.uid, 'categories')
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setUserCategories(snapshot.docs.map(d => d.data().name))
    })
    return () => unsubscribe()
  }, [user])

  // Load appearance settings from Firestore
  useEffect(() => {
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'settings', 'appearance')
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        if (data.theme) setCurrentTheme(data.theme)
        if (typeof data.darkMode === 'boolean') setDarkMode(data.darkMode)
      }
    })
    return () => unsubscribe()
  }, [user])

  // Check for shared prompt in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shared = params.get('share')
    if (shared) { try { const decoded = JSON.parse(decodeURIComponent(atob(shared))); setIncomingSharedPrompt(decoded) } catch { } }
  }, [])

  // Sync darkMode to DOM + localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Sync theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', currentTheme)
  }, [currentTheme])

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 2500) }

  const handleThemeChange = async (theme) => {
    setCurrentTheme(theme)
    if (user) {
      const ref = doc(db, 'users', user.uid, 'settings', 'appearance')
      await setDoc(ref, { theme, darkMode }, { merge: true })
    }
  }

  const handleDarkModeChange = async (value) => {
    setDarkMode(value)
    if (user) {
      const ref = doc(db, 'users', user.uid, 'settings', 'appearance')
      await setDoc(ref, { theme: currentTheme, darkMode: value }, { merge: true })
    }
  }

  const addPrompt = async (newPrompt) => {
    if (!user) return
    const ref = doc(collection(db, 'users', user.uid, 'prompts'))
    await setDoc(ref, { ...newPrompt, favorite: false, builtIn: false, collections: [], createdAt: Date.now() })
    showToast('Prompt added!')
  }

  const bulkAddPrompts = async (newPrompts) => {
    if (!user) return
    await Promise.all(newPrompts.map((p, i) => {
      const ref = doc(collection(db, 'users', user.uid, 'prompts'))
      return setDoc(ref, { ...p, favorite: false, builtIn: false, collections: [], createdAt: Date.now() + i })
    }))
    showToast(`${newPrompts.length} prompts imported!`)
  }

  const toggleFavorite = async (id) => {
    if (!user) return
    const userPrompt = userPrompts.find(p => p.id === id)
    if (userPrompt) {
      const ref = doc(db, 'users', user.uid, 'prompts', id)
      await setDoc(ref, { ...userPrompt, favorite: !userPrompt.favorite })
      return
    }
    const favRef = doc(db, 'users', user.uid, 'favorites', String(id))
    if (favorites[String(id)]) {
      await deleteDoc(favRef)
    } else {
      await setDoc(favRef, { promptId: String(id), favoritedAt: Date.now() })
    }
  }

  const deletePrompt = async (id) => {
    if (defaultPrompts.find(p => String(p.id) === String(id))) { showToast('Cannot delete built-in prompts'); return }
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'prompts', id))
    showToast('Prompt deleted!')
  }

  const addCollection = async ({ name, emoji }) => {
    if (!user) return
    const ref = doc(collection(db, 'users', user.uid, 'collections'))
    await setDoc(ref, { name, emoji, createdAt: Date.now() })
  }

  const deleteCollection = async (id) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'collections', id))
    if (activeCollection?.id === id) setActiveCollection(null)
    showToast('Collection deleted!')
  }

  const addToCollection = async (collectionId) => {
    if (!user || !collectionModalPrompt) return
    const prompt = userPrompts.find(p => p.id === collectionModalPrompt.id)
    if (!prompt) return
    const current = prompt.collections || []
    await setDoc(doc(db, 'users', user.uid, 'prompts', prompt.id), { ...prompt, collections: [...current, collectionId] })
    showToast('Added to collection!')
  }

  const removeFromCollection = async (collectionId) => {
    if (!user || !collectionModalPrompt) return
    const prompt = userPrompts.find(p => p.id === collectionModalPrompt.id)
    if (!prompt) return
    const current = prompt.collections || []
    await setDoc(doc(db, 'users', user.uid, 'prompts', prompt.id), { ...prompt, collections: current.filter(c => c !== collectionId) })
    showToast('Removed from collection!')
  }

  const addCategory = async (name) => {
    if (!user) return
    const ref = doc(collection(db, 'users', user.uid, 'categories'))
    await setDoc(ref, { name })
    showToast(`Category "${name}" created!`)
  }

  const deleteCategory = async (name) => {
    if (!user) return
    const ref = collection(db, 'users', user.uid, 'categories')
    const unsubscribe = onSnapshot(ref, async (snapshot) => {
      const docToDelete = snapshot.docs.find(d => d.data().name === name)
      if (docToDelete) await deleteDoc(doc(db, 'users', user.uid, 'categories', docToDelete.id))
      unsubscribe()
    })
    showToast(`Category "${name}" deleted!`)
  }

  const copyPrompt = (text) => { navigator.clipboard.writeText(text); showToast('Prompt copied!') }

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

  const allPrompts = [
    ...defaultPrompts.map(p => ({ ...p, favorite: !!favorites[String(p.id)] })),
    ...userPrompts
  ]

  const allCategories = ['All', ...new Set([...allPrompts.map(p => p.category), ...userCategories])]

  const filtered = allPrompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())) || p.prompt?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesFav = !showFavoritesOnly || p.favorite
    const matchesCollection = !activeCollection || p.collections?.includes(activeCollection.id)
    return matchesSearch && matchesCategory && matchesFav && matchesCollection
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
          setDarkMode={handleDarkModeChange}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          user={user}
          onSignOut={() => signOut(auth)}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex gap-6">
          <CollectionsSidebar
            collections={collections}
            activeCollection={activeCollection}
            onSelectCollection={setActiveCollection}
            onAddCollection={addCollection}
            onDeleteCollection={deleteCollection}
            prompts={userPrompts}
          />
          <main className="flex-1 min-w-0">
            {showTour && <OnboardingTour onFinish={() => { setShowTour(false); localStorage.setItem('tourDone', '1') }} />}
            <HeroSection promptCount={allPrompts.length} />
            <FeaturedSection prompts={allPrompts} onCopy={copyPrompt} onFavorite={toggleFavorite} onDelete={deletePrompt} onShare={(p) => setSharePrompt(p)} />
            <CategoriesSection
              categories={allCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddCategory={() => setShowAddCategory(true)}
              onDeleteCategory={deleteCategory}
              userCategories={userCategories}
            />
            <AddPromptForm onAdd={addPrompt} onBulkAdd={bulkAddPrompts} extraCategories={userCategories} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center py-16 text-gray-400 dark:text-gray-600">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-lg font-medium">No prompts found</p>
                  <p className="text-sm">Try a different search or category</p>
                </div>
              ) : (
                filtered.map(p => (
                  <PromptCard
                    key={p.id}
                    prompt={p}
                    onFavorite={() => toggleFavorite(p.id)}
                    onCopy={() => copyPrompt(p.prompt)}
                    onDelete={() => deletePrompt(p.id)}
                    onShare={() => setSharePrompt(p)}
                    onAddToCollection={() => setCollectionModalPrompt(p)}
                  />
                ))
              )}
            </div>
          </main>
        </div>
        <Footer />
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        {sharePrompt && <ShareModal prompt={sharePrompt} onClose={() => setSharePrompt(null)} />}
        {incomingSharedPrompt && <SharedPromptModal prompt={incomingSharedPrompt} onImport={importSharedPrompt} onClose={dismissSharedPrompt} />}
        {collectionModalPrompt && (
          <AddToCollectionModal
            prompt={collectionModalPrompt}
            collections={collections}
            onAdd={addToCollection}
            onRemove={removeFromCollection}
            onClose={() => setCollectionModalPrompt(null)}
          />
        )}
        {showAddCategory && <AddCategoryModal onAdd={addCategory} onClose={() => setShowAddCategory(false)} />}
      </div>
    </div>
  )
}

export default App