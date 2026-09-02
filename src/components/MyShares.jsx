import { useState, useEffect, useRef } from 'react'
import { collection, doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import useFocusTrap from '../hooks/useFocusTrap'

export default function MySharesModal({ user, onClose, showToast }) {
  const modalRef = useRef(null)
  useFocusTrap(modalRef, onClose)

  const [sharedPrompts, setSharedPrompts] = useState([])
  const [sharedCollections, setSharedCollections] = useState([])

  useEffect(() => {
    if (!user) return
    const pRef = collection(db, 'sharedPrompts')
    const cRef = collection(db, 'sharedCollections')
    const unsubP = onSnapshot(pRef, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.ownerId === user.uid)
      setSharedPrompts(items)
    })
    const unsubC = onSnapshot(cRef, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.ownerId === user.uid)
      setSharedCollections(items)
    })
    return () => { unsubP(); unsubC() }
  }, [user])

  const revokeDoc = async (type, id) => {
    if (!window.confirm('Revoke this share? This will disable the link for others.')) return
    try {
      const col = type === 'prompt' ? 'sharedPrompts' : 'sharedCollections'
      await setDoc(doc(db, col, id), { active: false, revokedAt: serverTimestamp() }, { merge: true })
      showToast && showToast({ message: 'Share revoked', actionLabel: 'Undo', onAction: async () => { await setDoc(doc(db, col, id), { active: true, revokedAt: null }, { merge: true }); showToast && showToast('Share restored') } })
    } catch (err) {
      console.error('revoke error', err)
      showToast && showToast({ message: 'Failed to revoke', type: 'error' })
    }
  }

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true" aria-labelledby="myshares-title" tabIndex={-1}>
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-3xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="text-2xl" aria-hidden>📤</span><h2 id="myshares-title" className="font-bold text-gray-900 dark:text-white text-lg">My Shares</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Shared Prompts</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {sharedPrompts.length === 0 && <p className="text-xs text-gray-400">No shared prompts</p>}
              {sharedPrompts.map(p => (
                <div key={p.id} className="p-3 border rounded-lg flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">{p.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{p.prompt}</p>
                    <p className="text-xs text-gray-400 mt-1">Visibility: {p.visibility || 'anyone'}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={`/s/${p.id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Open</a>
                    {p.active === false ? <span className="text-xs text-red-400">Revoked</span> : <button onClick={() => revokeDoc('prompt', p.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded">Revoke</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Shared Collections</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {sharedCollections.length === 0 && <p className="text-xs text-gray-400">No shared collections</p>}
              {sharedCollections.map(c => (
                <div key={c.id} className="p-3 border rounded-lg flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">{c.name}</p>
                    <p className="text-xs text-gray-400">Prompts: {Array.isArray(c.prompts) ? c.prompts.length : 0}</p>
                    <p className="text-xs text-gray-400 mt-1">Visibility: {c.visibility || 'anyone'}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={`/c/${c.id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Open</a>
                    {c.active === false ? <span className="text-xs text-red-400">Revoked</span> : <button onClick={() => revokeDoc('collection', c.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded">Revoke</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
