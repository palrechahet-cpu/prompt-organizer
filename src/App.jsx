import { useState, useEffect, useRef } from 'react'
import useFocusTrap from './hooks/useFocusTrap'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, addDoc, getDoc, serverTimestamp } from 'firebase/firestore'
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
import MySharesModal from './components/MyShares'

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

function buildShareUrl(type, id) {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') || '/'
  const route = `${base === '/' ? '' : base}/${type === 'prompt' ? 's' : 'c'}/${id}`.replace(/\/+/g, '/')
  url.pathname = route
  return url.toString()
}

function getRouteShareMeta() {
  const pathname = decodeURIComponent(window.location.pathname || '/')
  const match = pathname.match(/(?:^|\/)([sc])\/([^/]+)$/)
  if (!match) return null
  return { type: match[1] === 's' ? 'prompt' : 'collection', id: match[2] }
}

function resetShareUrl() {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') || '/'
  url.pathname = base === '/' ? '/' : base
  window.history.replaceState({}, '', url.toString())
}

function ShareModal({ prompt, onClose, user, onRevoke, showToast }) {
  const modalRef = useRef(null)
  useFocusTrap(modalRef, onClose)
  const [copied, setCopied] = useState(false)
  const [creating, setCreating] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [visibility, setVisibility] = useState('anyone') // 'private' | 'anyone' | 'public'
  const [consentPublic, setConsentPublic] = useState(false)
  const [shareDocId, setShareDocId] = useState('')
  const [shareOwnerId, setShareOwnerId] = useState(null)

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  const createSharedLink = async () => {
    setCreating(true)
    try {
      const payload = { title: prompt.title, category: prompt.category, prompt: prompt.prompt, tags: prompt.tags || [], visibility, active: true, createdAt: Date.now() }
      if (user) { payload.ownerId = user.uid; payload.ownerName = user.displayName || null; payload.ownerPhoto = user.photoURL || null }
      const ref = await addDoc(collection(db, 'sharedPrompts'), payload)
      setShareDocId(ref.id)
      setShareOwnerId(payload.ownerId || null)
      const link = buildShareUrl('prompt', ref.id)
      setShareUrl(link)
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('createSharedLink error', err)
      showToast?.({ message: 'Could not create a share link right now.', type: 'error' })
    }
    setCreating(false)
  }

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="text-xl">🔗</span><h2 className="font-bold text-gray-900 dark:text-white text-lg">Share Prompt</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none transition-colors">✕</button>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 border border-gray-100 dark:border-zinc-700">
          <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{prompt.title}</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2">{prompt.prompt}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold">Visibility</label>
            <div className="flex items-center gap-2 text-xs">
              <label className="inline-flex items-center gap-2"><input type="radio" name="vis" value="private" checked={visibility==='private'} onChange={() => setVisibility('private')} /> Private</label>
              <label className="inline-flex items-center gap-2"><input type="radio" name="vis" value="anyone" checked={visibility==='anyone'} onChange={() => setVisibility('anyone')} /> Anyone with link</label>
              <label className="inline-flex items-center gap-2"><input type="radio" name="vis" value="public" checked={visibility==='public'} onChange={() => setVisibility('public')} /> Public</label>
            </div>
          </div>
          {visibility === 'public' && (
            <div className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={consentPublic} onChange={e => setConsentPublic(e.target.checked)} />
              <span>I understand this will make the prompt publicly discoverable.</span>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input readOnly value={shareUrl} placeholder="Create a persistent link" className="flex-1 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-gray-500 dark:text-gray-400 truncate focus:outline-none" />
            <button onClick={createSharedLink} disabled={creating || (visibility==='public' && !consentPublic)} className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${copied ? 'bg-green-500 text-white' : 'text-white shadow-sm'}`} style={{ backgroundColor: copied ? undefined : 'var(--color-primary)' }}>{copied ? '✓ Copied!' : (creating ? 'Creating...' : 'Create Link')}</button>
            {shareDocId && shareOwnerId && user && shareOwnerId === user.uid && (
              <button onClick={async () => { await onRevoke('prompt', shareDocId); setShareUrl('') }} className="ml-2 px-3 py-2 rounded-lg bg-red-500 text-white text-xs">Revoke</button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">Short permanent link stored in the app — anyone can view and import.</p>
      </div>
    </div>
  )
}

function ShareCollectionModal({ collection, prompts, user, onClose, onRevoke, showToast }) {
  const modalRef = useRef(null)
  useFocusTrap(modalRef, onClose)
  const [copied, setCopied] = useState(false)
  const [creating, setCreating] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [visibility, setVisibility] = useState('anyone')
  const [consentPublic, setConsentPublic] = useState(false)
  const [shareDocId, setShareDocId] = useState('')
  const [shareOwnerId, setShareOwnerId] = useState(null)

  const createSharedCollection = async () => {
    setCreating(true)
    try {
      const payload = {
        name: collection.name,
        emoji: collection.emoji,
        ownerId: user ? user.uid : null,
        ownerName: user ? user.displayName : null,
        ownerPhoto: user ? user.photoURL : null,
        visibility,
        active: true,
        prompts: prompts.filter(p => p.collections?.includes(collection.id)).map(p => ({ title: p.title, prompt: p.prompt, category: p.category, tags: p.tags || [] })),
        createdAt: Date.now()
      }
      const ref = await addDoc(collection(db, 'sharedCollections'), payload)
      setShareDocId(ref.id)
      setShareOwnerId(payload.ownerId || null)
      const link = buildShareUrl('collection', ref.id)
      setShareUrl(link)
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('createSharedCollection error', err)
      showToast?.({ message: 'Could not create a collection share link.', type: 'error' })
    }
    setCreating(false)
  }

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="text-xl">🔗</span><h2 className="font-bold text-gray-900 dark:text-white text-lg">Share Collection</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none transition-colors">✕</button>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 border border-gray-100 dark:border-zinc-700">
          <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{collection.name}</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs">Includes {prompts.filter(p => p.collections?.includes(collection.id)).length} prompts</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold">Visibility</label>
            <div className="flex items-center gap-2 text-xs">
              <label className="inline-flex items-center gap-2"><input type="radio" name="col-vis" value="private" checked={visibility==='private'} onChange={() => setVisibility('private')} /> Private</label>
              <label className="inline-flex items-center gap-2"><input type="radio" name="col-vis" value="anyone" checked={visibility==='anyone'} onChange={() => setVisibility('anyone')} /> Anyone with link</label>
              <label className="inline-flex items-center gap-2"><input type="radio" name="col-vis" value="public" checked={visibility==='public'} onChange={() => setVisibility('public')} /> Public</label>
            </div>
          </div>
          {visibility === 'public' && (
            <div className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={consentPublic} onChange={e => setConsentPublic(e.target.checked)} />
              <span>I understand this will make the collection publicly discoverable.</span>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input readOnly value={shareUrl} placeholder="Create a persistent link" className="flex-1 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-gray-500 dark:text-gray-400 truncate focus:outline-none" />
            <button onClick={createSharedCollection} disabled={creating || (visibility==='public' && !consentPublic)} className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${copied ? 'bg-green-500 text-white' : 'text-white shadow-sm'}`} style={{ backgroundColor: copied ? undefined : 'var(--color-primary)' }}>{copied ? '✓ Copied!' : (creating ? 'Creating...' : 'Create Link')}</button>
            {shareDocId && shareOwnerId && user && shareOwnerId === user.uid && (
              <button onClick={async () => { await onRevoke('collection', shareDocId); setShareUrl('') }} className="ml-2 px-3 py-2 rounded-lg bg-red-500 text-white text-xs">Revoke</button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">Short permanent link stored in the app — anyone can view and import this collection.</p>
      </div>
    </div>
  )
}

function SharedPromptModal({ prompt, onImport, onClose, collections = [], onSaveToCollection }) {
  const modalRef = useRef(null)
  useFocusTrap(modalRef, onClose)
  const [selectedCollectionId, setSelectedCollectionId] = useState('')

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">Shared Prompt</h2>
            {prompt.ownerName && (
              <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                {prompt.ownerPhoto && <img src={prompt.ownerPhoto} alt={prompt.ownerName} className="w-5 h-5 rounded-full" />}
                <span>Shared by {prompt.ownerName}</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Someone shared this prompt with you. Save it to your library or a collection.</p>
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
        {collections.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Save to collection</label>
            <select value={selectedCollectionId} onChange={e => setSelectedCollectionId(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-700 dark:text-gray-200">
              <option value="">Choose a collection</option>
              {collections.map(col => <option key={col.id} value={col.id}>{col.name}</option>)}
            </select>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={onImport} className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95" style={{ backgroundColor: 'var(--color-primary)' }}>Add to My Library</button>
          <button onClick={() => onSaveToCollection?.(selectedCollectionId)} disabled={!selectedCollectionId} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200">Save to Collection</button>
          <button onClick={onClose} className="py-2.5 px-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95">Dismiss</button>
        </div>
      </div>
    </div>
  )
}

function TrashModal({ deletedPrompts, onRestore, onPurge, onClose }) {
  const modalRef = useRef(null)
  useFocusTrap(modalRef, onClose)
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }
  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="text-2xl">🗑️</span><h2 className="font-bold text-gray-900 dark:text-white text-lg">Trash</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none transition-colors">✕</button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Items in Trash are recoverable for 7 days before permanent deletion.</p>
        <div className="max-h-80 overflow-y-auto">
          {deletedPrompts.length === 0 ? (
            <p className="text-gray-400 text-sm">No items in Trash</p>
          ) : (
            deletedPrompts.map(p => (
              <div key={p.id} className="flex items-start justify-between gap-4 p-3 rounded-lg border border-gray-100 dark:border-zinc-700 mb-2">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">{p.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{p.prompt}</p>
                  <p className="text-xs text-gray-400 mt-1">Deleted {p.deletedAt ? new Date(p.deletedAt).toLocaleString() : ''}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onRestore(p.id)} className="py-1.5 px-3 bg-green-500 text-white rounded-lg text-xs">Restore</button>
                  <button onClick={() => onPurge(p.id)} className="py-1.5 px-3 bg-red-500 text-white rounded-lg text-xs">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function AddCategoryModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const modalRef = useRef(null)
  useFocusTrap(modalRef, onClose)
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }
  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
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
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition"
          style={{ '--tw-ring-color': 'var(--color-primary)' }}
        />
        <div className="flex gap-2">
          <button onClick={() => { if (name.trim()) { onAdd(name.trim()); onClose() } }} className="flex-1 py-3 text-white rounded-xl font-bold text-sm active:scale-95" style={{ backgroundColor: 'var(--color-primary)' }}>Create Category</button>
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
  const showToast = (payload) => {
    const t = typeof payload === 'string' ? { message: payload } : payload || { message: '' }
    setToast(t)
    setTimeout(() => setToast(null), 3000)
  }

  const revokeSharedDoc = async (type, id) => {
    if (!window.confirm('Revoke this shared item? This will disable the link for others.')) return
    try {
      const col = type === 'prompt' ? 'sharedPrompts' : 'sharedCollections'
      await setDoc(doc(db, col, id), { active: false, revokedAt: serverTimestamp() }, { merge: true })
      showToast({ message: 'Share revoked', actionLabel: 'Undo', onAction: async () => { await setDoc(doc(db, col, id), { active: true, revokedAt: null }, { merge: true }); showToast('Share restored') } })
    } catch (err) {
      console.error('revokeSharedDoc error', err)
      showToast({ message: 'Failed to revoke', type: 'error' })
    }
  }
  const [sharePrompt, setSharePrompt] = useState(null)
  const [incomingSharedPrompt, setIncomingSharedPrompt] = useState(null)
  const [shareCollection, setShareCollection] = useState(null)
  const [incomingSharedCollection, setIncomingSharedCollection] = useState(null)
  const [collectionModalPrompt, setCollectionModalPrompt] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const [showMyShares, setShowMyShares] = useState(false)
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  const [bulkActionCollectionId, setBulkActionCollectionId] = useState('')

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!user) { setUserPrompts([]); return }
    const ref = collection(db, 'users', user.uid, 'prompts')
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
      setUserPrompts(loaded)
      // Auto-purge prompts that have been in Trash > 7 days
      const now = Date.now()
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      snapshot.docs.forEach(d => {
        const data = d.data()
        if (data && data.deleted && data.deletedAt && (now - data.deletedAt) > sevenDays) {
          // permanently delete
          deleteDoc(doc(db, 'users', user.uid, 'prompts', d.id)).catch(err => console.error('Auto-purge error', err))
        }
      })
    })
    return () => unsubscribe()
  }, [user])

  // Load favorites
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (shared) { try { const decoded = JSON.parse(decodeURIComponent(atob(shared))); setIncomingSharedPrompt(decoded) } catch (e) { console.error('decode shared param', e) } }
  }, [])

  // Check for persistent shared prompt via path /s/:id
  useEffect(() => {
    const tryLoadShared = async () => {
      try {
        const route = getRouteShareMeta()
        if (!route || route.type !== 'prompt') return
        const snap = await getDoc(doc(db, 'sharedPrompts', route.id))
        if (snap.exists()) {
          const data = snap.data()
          if (data.active === false) { showToast('This shared prompt has been revoked'); return }
          setIncomingSharedPrompt({ id: snap.id, ...data })
        } else {
          showToast('Shared prompt not found')
        }
      } catch (err) {
        console.error('Error loading shared prompt', err)
      }
    }
    tryLoadShared()
  }, [])

  // Check for persistent shared collection via path /c/:id
  useEffect(() => {
    const tryLoadSharedCollection = async () => {
      try {
        const route = getRouteShareMeta()
        if (!route || route.type !== 'collection') return
        const snap = await getDoc(doc(db, 'sharedCollections', route.id))
        if (snap.exists()) {
          const data = snap.data()
          if (data.active === false) { showToast('This shared collection has been revoked'); return }
          setIncomingSharedCollection({ id: snap.id, ...data })
        } else {
          showToast('Shared collection not found')
        }
      } catch (err) {
        console.error('Error loading shared collection', err)
      }
    }
    tryLoadSharedCollection()
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

  

  const trackUsage = async (promptId) => {
    if (!user || !promptId) return
    const ref = doc(db, 'users', user.uid, 'settings', 'usage')
    const current = usageStats[String(promptId)] || 0
    await setDoc(ref, { [String(promptId)]: current + 1 }, { merge: true })
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
    trackUsage(id)
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
    const userPrompt = userPrompts.find(p => p.id === id)
    if (!userPrompt) return
    // Soft-delete: mark as deleted with timestamp; allow restore within 7 days
    await setDoc(doc(db, 'users', user.uid, 'prompts', id), { ...userPrompt, deleted: true, deletedAt: Date.now() })
    showToast('Prompt moved to Trash. Restore within 7 days.')
  }

  const restorePrompt = async (id) => {
    if (!user) return
    const userPrompt = userPrompts.find(p => p.id === id)
    if (!userPrompt) return
    await setDoc(doc(db, 'users', user.uid, 'prompts', id), { ...userPrompt, deleted: false, deletedAt: null })
    showToast('Prompt restored')
  }

  const purgePrompt = async (id) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'prompts', id))
    showToast('Prompt permanently deleted')
  }

  const addCollection = async ({ name, emoji, parentId = null }) => {
    if (!user) return
    const ref = doc(collection(db, 'users', user.uid, 'collections'))
    await setDoc(ref, { name, emoji, parentId, createdAt: Date.now() })
  }

  const getCollectionDescendants = (id) => {
    const childIds = collections.filter(col => col.parentId === id).map(col => col.id)
    let all = [...childIds]
    childIds.forEach(childId => {
      all = [...all, ...getCollectionDescendants(childId)]
    })
    return all
  }

  const deleteCollection = async (id) => {
    if (!user) return
    const idsToDelete = [id, ...getCollectionDescendants(id)]
    await Promise.all(idsToDelete.map(collectionId => deleteDoc(doc(db, 'users', user.uid, 'collections', collectionId))))
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

  const toggleSelectedPrompt = (promptId) => {
    setSelectedPromptIds(prev => prev.includes(promptId)
      ? prev.filter(id => id !== promptId)
      : [...prev, promptId])
  }

  const bulkAddToCollection = async (collectionId) => {
    if (!user || !selectedPromptIds.length) return
    const selectedPrompts = userPrompts.filter(p => selectedPromptIds.includes(p.id))
    await Promise.all(selectedPrompts.map(async (prompt) => {
      const current = prompt.collections || []
      await setDoc(doc(db, 'users', user.uid, 'prompts', prompt.id), { ...prompt, collections: [...new Set([...current, collectionId])] })
    }))
    setSelectedPromptIds([])
    setBulkActionCollectionId('')
    showToast(`${selectedPrompts.length} prompts added to collection`)
  }

  const bulkRemoveFromCollection = async (collectionId) => {
    if (!user || !selectedPromptIds.length) return
    const selectedPrompts = userPrompts.filter(p => selectedPromptIds.includes(p.id))
    await Promise.all(selectedPrompts.map(async (prompt) => {
      const current = prompt.collections || []
      await setDoc(doc(db, 'users', user.uid, 'prompts', prompt.id), { ...prompt, collections: current.filter(c => c !== collectionId) })
    }))
    setSelectedPromptIds([])
    setBulkActionCollectionId('')
    showToast(`${selectedPrompts.length} prompts removed from collection`)
  }

  const copySelectedPrompts = async () => {
    if (!selectedPromptIds.length) return
    const selectedPrompts = userPrompts.filter(p => selectedPromptIds.includes(p.id))
    const payload = selectedPrompts.map(p => ({ title: p.title, prompt: p.prompt, category: p.category, tags: p.tags || [] }))
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setSelectedPromptIds([])
    showToast(`${payload.length} prompts copied to clipboard`)
  }

  const clearSelectedPrompts = () => setSelectedPromptIds([])

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

  const copyPrompt = (text, promptId) => {
    navigator.clipboard.writeText(text)
    showToast('Prompt copied!')
    if (promptId) trackUsage(promptId)
    if (promptId) trackRecentlyViewed(promptId)
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
      console.error('Delete account error:', err)
      showToast('Please sign out and sign back in, then try again.')
    }
  }

  const importSharedPrompt = () => {
    if (!incomingSharedPrompt) return
    addPrompt(incomingSharedPrompt)
    setIncomingSharedPrompt(null)
    resetShareUrl()
  }

  const saveSharedPromptToCollection = async (collectionId) => {
    if (!incomingSharedPrompt || !collectionId || !user) {
      if (!user) showToast('Sign in to save this prompt to a collection')
      return
    }

    const prompt = incomingSharedPrompt
    const userPromptRef = doc(collection(db, 'users', user.uid, 'prompts'))
    const newPrompt = { ...prompt, id: userPromptRef.id, favorite: false, builtIn: false, collections: [collectionId], createdAt: Date.now() }
    await setDoc(userPromptRef, newPrompt)
    showToast('Prompt saved to your collection')
    setIncomingSharedPrompt(null)
    resetShareUrl()
  }

  const importSharedCollection = async (shared, collectionId = null) => {
    if (!shared) return
    if (!user) { showToast('Sign in to import this collection'); return }
    try {
      let targetCollectionId = collectionId
      if (!targetCollectionId) {
        const ref = doc(collection(db, 'users', user.uid, 'collections'))
        await setDoc(ref, { name: shared.name, emoji: shared.emoji, createdAt: Date.now() })
        targetCollectionId = ref.id
      }

      await Promise.all((shared.prompts || []).map(async (p, i) => {
        const pref = doc(collection(db, 'users', user.uid, 'prompts'))
        await setDoc(pref, { ...p, favorite: false, builtIn: false, collections: [targetCollectionId], createdAt: Date.now() + i })
      }))
      showToast(collectionId ? 'Collection saved to your account' : 'Collection imported!')
      setIncomingSharedCollection(null)
      resetShareUrl()
    } catch (err) {
      console.error('importSharedCollection error', err)
      showToast('Import failed')
    }
  }

  const dismissSharedCollection = () => {
    setIncomingSharedCollection(null)
    resetShareUrl()
  }

  const dismissSharedPrompt = () => {
    setIncomingSharedPrompt(null)
    resetShareUrl()
  }

  const allPrompts = [
    ...defaultPrompts.map(p => ({ ...p, favorite: !!favorites[String(p.id)] })),
    ...userPrompts.filter(p => !p.deleted)
  ]

  const allCategories = ['All', ...new Set([...allPrompts.map(p => p.category), ...userCategories])]

  const normalizedSearch = search.trim().toLowerCase()
  const filtered = allPrompts
    .filter(p => {
      const lowerTitle = (p.title || '').toLowerCase()
      const lowerPrompt = (p.prompt || '').toLowerCase()
      const lowerCategory = (p.category || '').toLowerCase()
      const lowerTags = (p.tags || []).map(tag => String(tag).toLowerCase())
      const matchesSearch = !normalizedSearch || lowerTitle.includes(normalizedSearch) || lowerPrompt.includes(normalizedSearch) || lowerCategory.includes(normalizedSearch) || lowerTags.some(tag => tag.includes(normalizedSearch))
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory
      const matchesFav = !showFavoritesOnly || p.favorite
      const matchesCollection = !activeCollection || p.collections?.includes(activeCollection.id)
      return matchesSearch && matchesCategory && matchesFav && matchesCollection
    })
    .map(p => {
      if (!normalizedSearch) return { item: p, score: 0 }

      const lowerTitle = (p.title || '').toLowerCase()
      const lowerPrompt = (p.prompt || '').toLowerCase()
      const lowerCategory = (p.category || '').toLowerCase()
      const lowerTags = (p.tags || []).map(tag => String(tag).toLowerCase())

      let score = 0
      if (lowerTitle === normalizedSearch) score += 200
      if (lowerTitle.includes(normalizedSearch)) score += 100
      if (lowerPrompt.includes(normalizedSearch)) score += 60
      if (lowerCategory === normalizedSearch) score += 80
      if (lowerCategory.includes(normalizedSearch)) score += 40
      if (lowerTags.some(tag => tag === normalizedSearch)) score += 80
      if (lowerTags.some(tag => tag.includes(normalizedSearch))) score += 30

      return { item: p, score }
    })
    .sort((a, b) => {
      if (!normalizedSearch) return 0
      return b.score - a.score
    })
    .map(entry => entry.item)

  // When the user types a search, bring the results into view so they
  // don't have to manually scroll down to find matches.
  useEffect(() => {
    try {
      if (!search || typeof window === 'undefined') return
      const mainEl = document.querySelector('main')
      if (mainEl && mainEl.scrollIntoView) {
        // smooth behavior makes the transition less jarring
        mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } catch (e) {
      // swallow any errors — this is a nicety, not critical
      console.error('scroll-to-search error', e)
    }
  }, [search])

  // Global keyboard shortcut: press '/' to focus the search input
  useEffect(() => {
    const onKey = (e) => {
      // ignore when modifier keys are pressed or when typing in inputs
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (document.activeElement && document.activeElement.tagName) || ''
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return
      if (e.key === '/') {
        e.preventDefault()
        const el = document.getElementById('global-search-input') || document.getElementById('global-search-input-mobile')
        if (el) el.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

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
          onDeleteAccount={deleteAccount}
          onOpenShares={() => setShowMyShares(true)}
          onOpenTrash={() => setShowTrash(true)}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex gap-6">
          <CollectionsSidebar
            collections={collections}
            activeCollection={activeCollection}
            onSelectCollection={setActiveCollection}
            onAddCollection={addCollection}
            onDeleteCollection={deleteCollection}
            onShareCollection={(col) => { if (!user) { showToast('Sign in to share collections'); return } setShareCollection(col) }}
            prompts={userPrompts.filter(p => !p.deleted)}
          />
          <main className="flex-1 min-w-0">
            {showTour && <OnboardingTour onFinish={() => { setShowTour(false); localStorage.setItem('tourDone', '1') }} />}
            <HeroSection
              promptCount={allPrompts.length}
              user={user}
              usageStats={usageStats}
            />
            <SmartSection
              usageStats={usageStats}
              allPrompts={allPrompts}
              recentlyViewed={recentlyViewed}
              onCopy={(text, id) => copyPrompt(text, id)}
              onFavorite={toggleFavorite}
              onDelete={deletePrompt}
              onShare={(p) => setSharePrompt(p)}
              onAddToCollection={(p) => setCollectionModalPrompt(p)}
            />
            <FeaturedSection
              prompts={allPrompts}
              onCopy={(text) => copyPrompt(text)}
              onFavorite={toggleFavorite}
              onDelete={deletePrompt}
              onShare={(p) => setSharePrompt(p)}
              onAddToCollection={(p) => setCollectionModalPrompt(p)}
            />
            <CategoriesSection
              categories={allCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddCategory={() => setShowAddCategory(true)}
              onDeleteCategory={deleteCategory}
              userCategories={userCategories}
            />
            <AddPromptForm onAdd={addPrompt} onBulkAdd={bulkAddPrompts} extraCategories={userCategories} />
            {selectedPromptIds.length > 0 && (
              <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-200 dark:border-white/8 bg-white dark:bg-zinc-900 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{selectedPromptIds.length} selected</p>
                  <button onClick={clearSelectedPrompts} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={bulkActionCollectionId}
                    onChange={e => setBulkActionCollectionId(e.target.value)}
                    className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-xs text-gray-700 dark:text-gray-200"
                  >
                    <option value="">Choose collection</option>
                    {collections.map(col => <option key={col.id} value={col.id}>{col.name}</option>)}
                  </select>
                  <button
                    onClick={() => bulkActionCollectionId && bulkAddToCollection(bulkActionCollectionId)}
                    disabled={!bulkActionCollectionId}
                    className="rounded-lg bg-orange-500 text-white px-3 py-2 text-xs font-medium disabled:opacity-50"
                  >Add to selected</button>
                  <button
                    onClick={() => bulkActionCollectionId && bulkRemoveFromCollection(bulkActionCollectionId)}
                    disabled={!bulkActionCollectionId}
                    className="rounded-lg bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 px-3 py-2 text-xs font-medium disabled:opacity-50"
                  >Remove from selected</button>
                  <button onClick={copySelectedPrompts} className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200">Copy JSON</button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center py-16 text-gray-400 dark:text-gray-600">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-lg font-medium">No prompts found</p>
                  <p className="text-sm">Try a different search or category</p>
                </div>
              ) : (
                <>
                  {search && filtered.length > 0 && (
                    <div className="col-span-full">
                      <div className="sticky top-20 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 mb-4 shadow-md">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">Best Match</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{filtered[0].title}</p>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1">{filtered[0].prompt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => copyPrompt(filtered[0].prompt, filtered[0].id)} className="px-3 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-xs">Copy</button>
                            <button onClick={() => { setCollectionModalPrompt(filtered[0]) }} className="px-3 py-2 bg-orange-500 text-white rounded-lg text-xs">Save to Collection</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(search ? filtered.slice(1) : filtered).map(p => (
                    <PromptCard
                      key={p.id}
                      prompt={p}
                      selected={selectedPromptIds.includes(p.id)}
                      selectable={true}
                      onToggleSelect={() => toggleSelectedPrompt(p.id)}
                      onFavorite={() => toggleFavorite(p.id)}
                      onCopy={() => copyPrompt(p.prompt, p.id)}
                      onDelete={() => deletePrompt(p.id)}
                      onShare={() => setSharePrompt(p)}
                      onAddToCollection={() => setCollectionModalPrompt(p)}
                    />
                  ))}
                </>
              )}
            </div>
          </main>
        </div>
        <Footer />
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        {showMyShares && user && <MySharesModal user={user} onClose={() => setShowMyShares(false)} showToast={showToast} />}
        {sharePrompt && <ShareModal prompt={sharePrompt} onClose={() => setSharePrompt(null)} user={user} showToast={showToast} onRevoke={revokeSharedDoc} />}
        {shareCollection && <ShareCollectionModal collection={shareCollection} prompts={allPrompts} user={user} onClose={() => setShareCollection(null)} showToast={showToast} onRevoke={revokeSharedDoc} />}
        {incomingSharedPrompt && (
          <SharedPromptModal
            prompt={incomingSharedPrompt}
            collections={collections}
            onImport={importSharedPrompt}
            onSaveToCollection={saveSharedPromptToCollection}
            onClose={dismissSharedPrompt}
          />
        )}
        {incomingSharedCollection && (
          <SharedPromptModal
            prompt={{ title: incomingSharedCollection.name, prompt: `${incomingSharedCollection.prompts.map(p => p.title).join('\n')}`, category: 'Collection', tags: [] }}
            collections={collections}
            onImport={() => importSharedCollection(incomingSharedCollection)}
            onSaveToCollection={(collectionId) => importSharedCollection(incomingSharedCollection, collectionId)}
            onClose={dismissSharedCollection}
          />
        )}
        {showTrash && <TrashModal deletedPrompts={userPrompts.filter(p => p.deleted)} onRestore={restorePrompt} onPurge={purgePrompt} onClose={() => setShowTrash(false)} />}
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