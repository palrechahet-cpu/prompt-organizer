import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore'
import { auth, db } from './firebase'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturedSection from './components/FeaturedSection'
import SmartSection from './components/SmartSection'
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
import copyToClipboard from './utils/clipboard'

const THEME_COLORS = {
  orange: { primary: '#f97316', secondary: '#f59e0b' },
  blue:   { primary: '#3b82f6', secondary: '#06b6d4' },
  purple: { primary: '#8b5cf6', secondary: '#a855f7' },
  green:  { primary: '#22c55e', secondary: '#10b981' },
  rose:   { primary: '#f43f5e', secondary: '#ec4899' },
}

function applyTheme(theme) {
  const c = THEME_COLORS[theme] || THEME_COLORS.orange
  document.documentElement.style.setProperty('--color-primary', c.primary)
  document.documentElement.style.setProperty('--color-secondary', c.secondary)
}

function ShareModal({ prompt, onClose, onCopyText }) {
  const [copied, setCopied] = useState(false)
  const shareUrlInfo = (() => {
    const payload = JSON.stringify({ title: prompt.title, category: prompt.category, prompt: prompt.prompt, tags: prompt.tags })
    const encoded = btoa(encodeURIComponent(payload))
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('share', encoded)
    return { url: url.toString(), payload }
  })()

  const copyLink = async () => {
    // If the URL is too long, skip trying to copy it and copy payload instead
    try {
      if (shareUrlInfo.url.length > 2000) throw new Error('URL too long')
      await copyToClipboard(shareUrlInfo.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      try {
        await onCopyText(shareUrlInfo.payload)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        console.error('Copy failed', e)
      }
    }
  }

  const downloadJSON = () => {
    try {
      const blob = new Blob([shareUrlInfo.payload], { type: 'application/json' })
      const href = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = href
      a.download = `${prompt.title.replace(/[^a-z0-9_\-]/gi, '_') || 'prompt'}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(href)
    } catch (e) { console.error('Download failed', e) }
  }

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
          <input readOnly value={shareUrlInfo.url} className="flex-1 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-gray-500 dark:text-gray-400" />
          <button onClick={copyLink} className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${copied ? 'bg-green-500 text-white' : 'bg-[#eef2ff] text-[#1f2937]'}`}>Copy</button>
          <button onClick={downloadJSON} className="flex-shrink-0 px-3 py-2.5 rounded-xl text-xs font-medium bg-gray-100">Download</button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">Anyone with this link can view and import this prompt. If the link is too large, the prompt JSON will be copied instead.</p>
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
          <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{prompt.category}</span>
          <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed line-clamp-4">{prompt.prompt}</p>
          {prompt.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {prompt.tags.map(tag => (<span key={tag} className="px-2 py-0.5 bg-white dark:bg-zinc-700 text-gray-400 text-xs rounded-lg border border-gray-100 dark:border-zinc-600">#{tag}</span>))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onImport} className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95" style={{ backgroundColor: 'var(--color-primary)' }}>Add to Library</button>
          <button onClick={onClose} className="py-2.5 px-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-semibold">Cancel</button>
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
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': 'var(--color-primary)' }}
        />
        <div className="flex gap-2">
          <button onClick={() => { if (name.trim()) { onAdd(name.trim()); onClose() } }} className="flex-1 py-3 text-white rounded-xl font-bold text-sm active:scale-95" style={{ backgroundColor: 'var(--color-primary)' }}>Create</button>
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
  const [usageStats, setUsageStats] = useState({})
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recentlyViewed') || '[]') } catch { return [] }
  })
  const [collections, setCollections] = useState([])
  const [userCategories, setUserCategories] = useState([])
  const [activeCollection, setActiveCollection] = useState(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') !== 'false')
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme') || 'orange'
    applyTheme(saved)
    return saved
  })
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

  // Load favorites
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

  // Load usage stats
  useEffect(() => {
    if (!user) { setUsageStats({}); return }
    const ref = doc(db, 'users', user.uid, 'settings', 'usage')
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) setUsageStats(snap.data())
      else setUsageStats({})
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

  // Load appearance settings
  useEffect(() => {
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'settings', 'appearance')
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        if (data.theme) { setCurrentTheme(data.theme); applyTheme(data.theme) }
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

  // Sync darkMode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Sync theme
  useEffect(() => {
    localStorage.setItem('theme', currentTheme)
    applyTheme(currentTheme)
  }, [currentTheme])

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 2500) }

+  const copyTextToClipboard = async (text) => {
+    try {
+      await copyToClipboard(text)
+      showToast('Copied to clipboard!')
+    } catch (e) {
+      console.error('Copy failed', e)
+      showToast('Copy failed')
+      throw e
+    }
+  }
+
   const trackUsage = async (promptId) => {
     if (!user || !promptId) return
     const ref = doc(db, 'users', user.uid, 'settings', 'usage')
     const current = usageStats[String(promptId)] || 0
-    await setDoc(ref, { [String(promptId)]: current + 1 }, { merge: true })
+    try { await setDoc(ref, { [String(promptId)]: current + 1 }, { merge: true }) } catch (e) { console.error('trackUsage error', e) }
   }
 
   const trackRecentlyViewed = (promptId) => {
     if (!promptId) return
     setRecentlyViewed(prev => {
       const filtered = prev.filter(id => String(id) !== String(promptId))
       const updated = [String(promptId), ...filtered].slice(0, 5)
       localStorage.setItem('recentlyViewed', JSON.stringify(updated))
       return updated
     })
   }
 
   const handleThemeChange = async (theme) => {
     setCurrentTheme(theme)
     applyTheme(theme)
     if (user) {
-      const ref = doc(db, 'users', user.uid, 'settings', 'appearance')
-      await setDoc(ref, { theme, darkMode }, { merge: true })
+      try {
+        const ref = doc(db, 'users', user.uid, 'settings', 'appearance')
+        await setDoc(ref, { theme, darkMode }, { merge: true })
+      } catch (e) { console.error('handleThemeChange error', e); showToast('Failed to save theme') }
     }
   }
 
   const handleDarkModeChange = async (value) => {
     setDarkMode(value)
     if (user) {
-      const ref = doc(db, 'users', user.uid, 'settings', 'appearance')
-      await setDoc(ref, { theme: currentTheme, darkMode: value }, { merge: true })
+      try {
+        const ref = doc(db, 'users', user.uid, 'settings', 'appearance')
+        await setDoc(ref, { theme: currentTheme, darkMode: value }, { merge: true })
+      } catch (e) { console.error('handleDarkModeChange error', e); showToast('Failed to save appearance') }
     }
   }
 
   const addPrompt = async (newPrompt) => {
-    if (!user) return
-    const ref = doc(collection(db, 'users', user.uid, 'prompts'))
-    await setDoc(ref, { ...newPrompt, favorite: false, builtIn: false, collections: [], createdAt: Date.now() })
-    showToast('Prompt added!')
+    if (!user) return
+    try {
+      const ref = doc(collection(db, 'users', user.uid, 'prompts'))
+      await setDoc(ref, { ...newPrompt, favorite: false, builtIn: false, collections: [], createdAt: Date.now() })
+      showToast('Prompt added!')
+    } catch (e) { console.error('addPrompt error', e); showToast('Failed to add prompt') }
   }
 
   const bulkAddPrompts = async (newPrompts) => {
-    if (!user) return
-    await Promise.all(newPrompts.map((p, i) => {
-      const ref = doc(collection(db, 'users', user.uid, 'prompts'))
-      return setDoc(ref, { ...p, favorite: false, builtIn: false, collections: [], createdAt: Date.now() + i })
-    }))
-    showToast(`${newPrompts.length} prompts imported!`)
+    if (!user) return
+    try {
+      await Promise.all(newPrompts.map((p, i) => {
+        const ref = doc(collection(db, 'users', user.uid, 'prompts'))
+        return setDoc(ref, { ...p, favorite: false, builtIn: false, collections: [], createdAt: Date.now() + i })
+      }))
+      showToast(`${newPrompts.length} prompts imported!`)
+    } catch (e) { console.error('bulkAddPrompts error', e); showToast('Failed to import prompts') }
   }
 
   const toggleFavorite = async (id) => {
-    if (!user) return
-    trackUsage(id)
-    const userPrompt = userPrompts.find(p => p.id === id)
-    if (userPrompt) {
-      const ref = doc(db, 'users', user.uid, 'prompts', id)
-      await setDoc(ref, { ...userPrompt, favorite: !userPrompt.favorite })
-      return
-    }
-    const favRef = doc(db, 'users', user.uid, 'favorites', String(id))
-    if (favorites[String(id)]) {
-      await deleteDoc(favRef)
-    } else {
-      await setDoc(favRef, { promptId: String(id), favoritedAt: Date.now() })
-    }
+    if (!user) return
+    trackUsage(id)
+    try {
+      const userPrompt = userPrompts.find(p => p.id === id)
+      if (userPrompt) {
+        const ref = doc(db, 'users', user.uid, 'prompts', id)
+        await setDoc(ref, { ...userPrompt, favorite: !userPrompt.favorite })
+        return
+      }
+      const favRef = doc(db, 'users', user.uid, 'favorites', String(id))
+      if (favorites[String(id)]) {
+        await deleteDoc(favRef)
+      } else {
+        await setDoc(favRef, { promptId: String(id), favoritedAt: Date.now() })
+      }
+    } catch (e) { console.error('toggleFavorite error', e); showToast('Failed to update favorite') }
   }
 
   const deletePrompt = async (id) => {
-    if (defaultPrompts.find(p => String(p.id) === String(id))) { showToast('Cannot delete built-in prompts'); return }
-    if (!user) return
-    await deleteDoc(doc(db, 'users', user.uid, 'prompts', id))
-    showToast('Prompt deleted!')
+    if (defaultPrompts.find(p => String(p.id) === String(id))) { showToast('Cannot delete built-in prompts'); return }
+    if (!user) return
+    try {
+      await deleteDoc(doc(db, 'users', user.uid, 'prompts', id))
+      showToast('Prompt deleted!')
+    } catch (e) { console.error('deletePrompt error', e); showToast('Failed to delete prompt') }
   }
 
   const addCollection = async ({ name, emoji }) => {
-    if (!user) return
-    const ref = doc(collection(db, 'users', user.uid, 'collections'))
-    await setDoc(ref, { name, emoji, createdAt: Date.now() })
+    if (!user) return
+    try {
+      const ref = doc(collection(db, 'users', user.uid, 'collections'))
+      await setDoc(ref, { name, emoji, createdAt: Date.now() })
+    } catch (e) { console.error('addCollection error', e); showToast('Failed to create collection') }
   }
 
   const deleteCollection = async (id) => {
-    if (!user) return
-    await deleteDoc(doc(db, 'users', user.uid, 'collections', id))
-    if (activeCollection?.id === id) setActiveCollection(null)
-    showToast('Collection deleted!')
+    if (!user) return
+    try {
+      await deleteDoc(doc(db, 'users', user.uid, 'collections', id))
+      if (activeCollection?.id === id) setActiveCollection(null)
+      showToast('Collection deleted!')
+    } catch (e) { console.error('deleteCollection error', e); showToast('Failed to delete collection') }
   }
 
   const addToCollection = async (collectionId) => {
-    if (!user || !collectionModalPrompt) return
-    const prompt = userPrompts.find(p => p.id === collectionModalPrompt.id)
-    if (!prompt) return
-    const current = prompt.collections || []
-    await setDoc(doc(db, 'users', user.uid, 'prompts', prompt.id), { ...prompt, collections: [...current, collectionId] })
-    showToast('Added to collection!')
+    if (!user || !collectionModalPrompt) return
+    try {
+      const prompt = userPrompts.find(p => p.id === collectionModalPrompt.id)
+      if (!prompt) return
+      const current = prompt.collections || []
+      await setDoc(doc(db, 'users', user.uid, 'prompts', prompt.id), { ...prompt, collections: [...current, collectionId] })
+      showToast('Added to collection!')
+    } catch (e) { console.error('addToCollection error', e); showToast('Failed to add to collection') }
   }
 
   const removeFromCollection = async (collectionId) => {
-    if (!user || !collectionModalPrompt) return
-    const prompt = userPrompts.find(p => p.id === collectionModalPrompt.id)
-    if (!prompt) return
-    const current = prompt.collections || []
-    await setDoc(doc(db, 'users', user.uid, 'prompts', prompt.id), { ...prompt, collections: current.filter(c => c !== collectionId) })
-    showToast('Removed from collection!')
+    if (!user || !collectionModalPrompt) return
+    try {
+      const prompt = userPrompts.find(p => p.id === collectionModalPrompt.id)
+      if (!prompt) return
+      const current = prompt.collections || []
+      await setDoc(doc(db, 'users', user.uid, 'prompts', prompt.id), { ...prompt, collections: current.filter(c => c !== collectionId) })
+      showToast('Removed from collection!')
+    } catch (e) { console.error('removeFromCollection error', e); showToast('Failed to remove from collection') }
   }
 
   const addCategory = async (name) => {
-    if (!user) return
-    const ref = doc(collection(db, 'users', user.uid, 'categories'))
-    await setDoc(ref, { name })
-    showToast(`Category "${name}" created!`)
+    if (!user) return
+    try {
+      const ref = doc(collection(db, 'users', user.uid, 'categories'))
+      await setDoc(ref, { name })
+      showToast(`Category "${name}" created!`)
+    } catch (e) { console.error('addCategory error', e); showToast('Failed to create category') }
   }
 
   const deleteCategory = async (name) => {
-    if (!user) return
-    const ref = collection(db, 'users', user.uid, 'categories')
-    const unsubscribe = onSnapshot(ref, async (snapshot) => {
-      const docToDelete = snapshot.docs.find(d => d.data().name === name)
-      if (docToDelete) await deleteDoc(doc(db, 'users', user.uid, 'categories', docToDelete.id))
-      unsubscribe()
-    })
-    showToast(`Category "${name}" deleted!`)
+    if (!user) return
+    try {
+      const ref = collection(db, 'users', user.uid, 'categories')
+      const snapshot = await getDocs(ref)
+      const docToDelete = snapshot.docs.find(d => d.data().name === name)
+      if (docToDelete) await deleteDoc(doc(db, 'users', user.uid, 'categories', docToDelete.id))
+      showToast(`Category "${name}" deleted!`)
+    } catch (e) { console.error('deleteCategory error', e); showToast('Failed to delete category') }
   }
 
   const copyPrompt = (text, promptId) => {
-    navigator.clipboard.writeText(text)
-    showToast('Prompt copied!')
-    if (promptId) trackUsage(promptId)
-    if (promptId) trackRecentlyViewed(promptId)
+    copyToClipboard(text).then(() => {
+      showToast('Prompt copied!')
+      if (promptId) trackUsage(promptId)
+      if (promptId) trackRecentlyViewed(promptId)
+    }).catch((e) => {
+      console.error('copyPrompt error', e)
+      showToast('Copy failed')
+    })
   }
 
   const deleteAccount = async () => {
     if (!user) return
     try {
       const cols = ['prompts', 'favorites', 'collections', 'categories']
       await Promise.all(cols.map(async (col) => {
         const ref = collection(db, 'users', user.uid, col)
         const snapshot = await getDocs(ref)
         await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)))
       }))
       await Promise.allSettled([
         deleteDoc(doc(db, 'users', user.uid, 'settings', 'appearance')),
         deleteDoc(doc(db, 'users', user.uid, 'settings', 'usage')),
         deleteDoc(doc(db, 'users', user.uid, 'settings', 'apikey')),
       ])
       await user.delete()
     } catch (err) {
-      console.error('Delete account error:', err)
-      showToast('Please sign out and sign back in, then try again.')
+      console.error('Delete account error:', err)
+      const code = err?.code || ''
+      if (code.includes('recent') || code.includes('auth/requires-recent-login')) {
+        showToast('Recent login required — please sign out and sign back in, then try again.')
+      } else {
+        showToast('Account deletion failed. Please try again.')
+      }
     }
   }
@@
-  const allPrompts = [
-    ...defaultPrompts.map(p => ({ ...p, favorite: !!favorites[String(p.id)] })),
-    ...userPrompts
-  ]
+  const allPrompts = [
+    ...defaultPrompts.map(p => ({ ...p, favorite: !!favorites[String(p.id)] })),
+    ...userPrompts
+  ]
@@
-  if (authLoading) {
+  if (authLoading) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
         <div className="flex flex-col items-center gap-3">
           <span className="text-4xl animate-bounce">🎯</span>
           <p className="text-gray-400 text-sm">Loading...</p>
         </div>
       </div>
     )
   }
@@
-  return (
+  return (
     <div className={darkMode ? 'dark' : ''}>
       <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
         <Navbar
@@
-        {sharePrompt && <ShareModal prompt={sharePrompt} onClose={() => setSharePrompt(null)} />}
+        {sharePrompt && <ShareModal prompt={sharePrompt} onClose={() => setSharePrompt(null)} onCopyText={copyTextToClipboard} />}
*** End Patch
