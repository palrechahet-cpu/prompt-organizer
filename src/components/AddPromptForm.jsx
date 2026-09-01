import { useState, useRef } from 'react'
import useFocusTrap from '../hooks/useFocusTrap'

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M10 3.5V12M10 12L13 9M10 12L7 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 15.5H15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function AddPromptForm({ onAdd, onBulkAdd }) {
  const [open, setOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [importTab, setImportTab] = useState('json')
  const [pasteText, setPasteText] = useState('')
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState('')
  const [previewItems, setPreviewItems] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Writing', prompt: '', tags: '' })
  const jsonFileRef = useRef()
  const csvFileRef = useRef()
  const addModalRef = useRef(null)
  const importModalRef = useRef(null)

  useFocusTrap(addModalRef, () => setOpen(false))
  useFocusTrap(importModalRef, () => setImportOpen(false))

  const categories = ['Research', 'Writing', 'AI', 'Productivity', 'Education', 'Creative', 'Health & Fitness', 'Tech & Coding', 'Social Media', 'Product & Strategy', 'Ideation & Brainstorm']

  const handleSubmit = () => {
    if (form.title.trim() === '' || form.prompt.trim() === '') return
    onAdd({ title: form.title, category: form.category, prompt: form.prompt, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), builtIn: false })
    setForm({ title: '', category: 'Writing', prompt: '', tags: '' })
    setOpen(false)
  }

  const processPrompts = (items) => {
    if (!Array.isArray(items) || items.length === 0) { setImportError('No valid prompts found.'); return }
    const valid = items.filter(p => p.title && p.prompt)
    if (valid.length === 0) { setImportError('Each prompt needs at least a title and prompt field.'); return }
    const formatted = valid.map(p => ({
      title: p.title || 'Untitled',
      category: p.category || 'Writing',
      prompt: p.prompt || '',
      tags: Array.isArray(p.tags) ? p.tags : (p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      builtIn: false
    }))
    // show preview so the user can confirm and exclude items before importing
    setPreviewItems(formatted.map((p, i) => ({ ...p, __include: true, __idx: i })))
    setShowPreview(true)
    setImportError('')
    setPasteText('')
  }

  const handleJSONFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try { const parsed = JSON.parse(ev.target.result); processPrompts(Array.isArray(parsed) ? parsed : [parsed]) }
      catch (err) { console.error('Invalid JSON file import', err); setImportError('Invalid JSON file.') }
    }
    reader.readAsText(file)
  }

  const handleCSVFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const lines = ev.target.result.split('\n').filter(Boolean)
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
        const items = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
          const obj = {}
          headers.forEach((h, i) => { obj[h] = values[i] || '' })
          return obj
        })
        processPrompts(items)
      } catch (err) { console.error('Invalid CSV import', err); setImportError('Invalid CSV file.') }
    }
    reader.readAsText(file)
  }

  const handlePasteImport = () => {
    setImportError('')
    const text = pasteText.trim()
    if (!text) { setImportError('Please paste some content first.'); return }
    try { const parsed = JSON.parse(text); processPrompts(Array.isArray(parsed) ? parsed : [parsed]); return } catch (err) { console.debug('paste is not JSON', err) }
    try {
      const lines = text.split('\n').filter(Boolean)
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
      if (headers.includes('title') && headers.includes('prompt')) {
        const items = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
          const obj = {}
          headers.forEach((h, i) => { obj[h] = values[i] || '' })
          return obj
        })
        processPrompts(items); return
      }
    } catch (err) { console.debug('paste is not CSV', err) }
    setImportError('Could not parse content. Please use valid JSON or CSV format.')
  }

  const resetImport = () => { setImportError(''); setImportSuccess(''); setPasteText(''); setImportOpen(false) }

  const togglePreviewInclude = (idx) => {
    setPreviewItems(items => items.map(it => it.__idx === idx ? { ...it, __include: !it.__include } : it))
  }

  const confirmImport = async () => {
    const toImport = previewItems.filter(p => p.__include).map(p => { const copy = { ...p }; delete copy.__include; delete copy.__idx; return copy })
    if (toImport.length === 0) { setImportError('No prompts selected for import'); return }
    try {
      onBulkAdd(toImport)
      setImportSuccess(`✅ ${toImport.length} prompt${toImport.length > 1 ? 's' : ''} imported successfully!`)
      setPreviewItems([])
      setShowPreview(false)
      setTimeout(() => { setImportOpen(false); setImportSuccess('') }, 2000)
    } catch (err) {
      console.error('import confirm error', err)
      setImportError('Import failed')
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition"

  return (
    <div className="mb-8">

      {/* Import Modal */}
      {importOpen && (
        <div ref={importModalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true" aria-labelledby="import-modal-title" tabIndex={-1}>
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/8 shadow-2xl w-full max-w-lg p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📥</span>
                <h2 id="import-modal-title" className="font-bold text-gray-900 dark:text-white text-lg">Import Prompts</h2>
              </div>
              <button onClick={resetImport} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 transition hover:border-orange-200 hover:text-orange-500 dark:border-white/8 dark:bg-white/4 dark:text-gray-400 dark:hover:text-orange-400">
                <CloseIcon />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-xl p-1">
              {[['json', '📄 JSON'], ['csv', '📊 CSV'], ['paste', '📋 Paste']].map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => { setImportTab(tab); setImportError(''); setImportSuccess('') }}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={importTab === tab ? {
                    backgroundColor: 'var(--color-primary)',
                    color: 'white'
                  } : { color: '#9ca3af' }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* JSON Tab */}
            {importTab === 'json' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Upload a JSON file. Expected format:</p>
                <pre className="text-xs bg-gray-50 dark:bg-white/4 rounded-xl p-3 border border-gray-100 dark:border-white/6 text-gray-600 dark:text-gray-400 overflow-x-auto">{`[{ "title": "My Prompt", "category": "Writing", "prompt": "..." }]`}</pre>
                <input ref={jsonFileRef} type="file" accept=".json" onChange={handleJSONFile} className="hidden" />
                <button
                  onClick={() => jsonFileRef.current.click()}
                  className="w-full py-3 border-2 border-dashed rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                >Click to Upload JSON File</button>
              </div>
            )}

            {/* CSV Tab */}
            {importTab === 'csv' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Upload a CSV file. Expected headers:</p>
                <pre className="text-xs bg-gray-50 dark:bg-white/4 rounded-xl p-3 border border-gray-100 dark:border-white/6 text-gray-600 dark:text-gray-400 overflow-x-auto">{`title,category,prompt,tags`}</pre>
                <input ref={csvFileRef} type="file" accept=".csv" onChange={handleCSVFile} className="hidden" />
                <button
                  onClick={() => csvFileRef.current.click()}
                  className="w-full py-3 border-2 border-dashed rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                >Click to Upload CSV File</button>
              </div>
            )}

            {/* Paste Tab */}
            {importTab === 'paste' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Paste JSON or CSV content directly:</p>
                <textarea
                  value={pasteText}
                  onChange={e => setPasteText(e.target.value)}
                  placeholder='[{"title": "My Prompt", "category": "Writing", "prompt": "..."}]'
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-xs font-mono focus:outline-none focus:ring-2 transition resize-none"
                  style={{ '--tw-ring-color': 'var(--color-primary)' }}
                />
                <button
                  onClick={handlePasteImport}
                  className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >Import Prompts</button>
              </div>
            )}

            {/* Preview UI */}
            {showPreview && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Preview parsed prompts — uncheck any you don't want to import.</p>
                <div className="max-h-64 overflow-y-auto space-y-2 p-2 bg-gray-50 dark:bg-white/4 rounded-lg border border-gray-100 dark:border-white/6">
                  {previewItems.map((p, i) => (
                    <label key={i} className="flex items-start gap-3 p-2 rounded-md hover:bg-white dark:hover:bg-white/6">
                      <input type="checkbox" checked={p.__include} onChange={() => togglePreviewInclude(p.__idx)} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{p.title}</p>
                          <p className="text-xs text-gray-400">{p.category}</p>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">{p.prompt}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={confirmImport} className="flex-1 py-3 text-white rounded-xl font-bold text-sm" style={{ backgroundColor: 'var(--color-primary)' }}>Confirm Import</button>
                  <button onClick={() => setShowPreview(false)} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 rounded-xl font-bold text-sm">Cancel</button>
                </div>
              </div>
            )}

            {importError && <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl px-4 py-3"><span>❌</span><p className="text-xs text-red-600 dark:text-red-400">{importError}</p></div>}
            {importSuccess && <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-xl px-4 py-3"><p className="text-xs text-green-600 dark:text-green-400 font-semibold">{importSuccess}</p></div>}
          </div>
        </div>
      )}

      {/* Buttons Row */}
      {!open && (
        <div className="flex gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 rounded-2xl border border-dashed border-orange-200 bg-orange-50/80 px-5 py-4 text-sm font-semibold text-orange-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-100 dark:border-orange-500/20 dark:bg-orange-500/8 dark:text-orange-300"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 shadow-sm text-orange-500"><PlusIcon /></span>
              Add Your Own Prompt
            </span>
          </button>
          <button
            onClick={() => setImportOpen(true)}
            className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-sm font-semibold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/8 dark:bg-zinc-900/80 dark:text-slate-300"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/6 dark:text-slate-200"><DownloadIcon /></span>
              Import
            </span>
          </button>
        </div>
      )}

      {/* Add Prompt Form */}
      {open && (
        <div ref={addModalRef} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/8 p-6 shadow-xl animate-scale-in" role="dialog" aria-modal="true" aria-labelledby="add-prompt-title" tabIndex={-1}>
          <div className="flex items-center justify-between mb-6">
            <h3 id="add-prompt-title" className="font-bold text-gray-900 dark:text-white text-xl">Add New Prompt</h3>
            <button onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition hover:border-orange-200 hover:text-orange-500 dark:border-white/8 dark:bg-white/4 dark:text-gray-400 dark:hover:text-orange-400">
              <CloseIcon />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Title *</label>
              <input type="text" placeholder="e.g. My Email Writer" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} style={{ '--tw-ring-color': 'var(--color-primary)' }} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputClass} style={{ '--tw-ring-color': 'var(--color-primary)' }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Prompt Text *</label>
              <textarea placeholder="Write your prompt here..." value={form.prompt} onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))} rows={4} className={`${inputClass} resize-none`} style={{ '--tw-ring-color': 'var(--color-primary)' }} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Tags <span className="normal-case font-normal">(comma separated)</span></label>
              <input type="text" placeholder="e.g. writing, email, business" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className={inputClass} style={{ '--tw-ring-color': 'var(--color-primary)' }} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              className="primary-button flex-1 rounded-xl py-3 font-bold text-sm active:scale-[0.99]"
            >Add Prompt</button>
            <button onClick={() => setOpen(false)} className="secondary-button flex-1 rounded-xl py-3 font-bold text-sm active:scale-[0.99]">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}