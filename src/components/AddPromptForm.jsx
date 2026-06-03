import { useState, useRef } from 'react'

export default function AddPromptForm({ onAdd, onBulkAdd }) {
  const [open, setOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [importTab, setImportTab] = useState('json')
  const [pasteText, setPasteText] = useState('')
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState('')
  const [form, setForm] = useState({ title: '', category: 'Writing', prompt: '', tags: '' })
  const jsonFileRef = useRef()
  const csvFileRef = useRef()

  const categories = ['Research', 'Writing', 'AI', 'Productivity', 'Education', 'Psychology', 'Creative', 'Health & Fitness', 'Tech & Coding', 'Social Media']

  const handleSubmit = () => {
    if (form.title.trim() === '' || form.prompt.trim() === '') return
    onAdd({
      title: form.title,
      category: form.category,
      prompt: form.prompt,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      builtIn: false
    })
    setForm({ title: '', category: 'Writing', prompt: '', tags: '' })
    setOpen(false)
  }

  const processPrompts = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      setImportError('No valid prompts found.')
      return
    }
    const valid = items.filter(p => p.title && p.prompt)
    if (valid.length === 0) {
      setImportError('Each prompt needs at least a title and prompt field.')
      return
    }
    const formatted = valid.map(p => ({
      title: p.title || 'Untitled',
      category: p.category || 'Writing',
      prompt: p.prompt || '',
      tags: Array.isArray(p.tags) ? p.tags : (p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      builtIn: false
    }))
    onBulkAdd(formatted)
    setImportSuccess(`✅ ${formatted.length} prompt${formatted.length > 1 ? 's' : ''} imported successfully!`)
    setImportError('')
    setPasteText('')
    setTimeout(() => { setImportOpen(false); setImportSuccess('') }, 2000)
  }

  const handleJSONFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        processPrompts(Array.isArray(parsed) ? parsed : [parsed])
      } catch {
        setImportError('Invalid JSON file. Please check the format.')
      }
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
      } catch {
        setImportError('Invalid CSV file. Please check the format.')
      }
    }
    reader.readAsText(file)
  }

  const handlePasteImport = () => {
    setImportError('')
    const text = pasteText.trim()
    if (!text) { setImportError('Please paste some content first.'); return }
    // Try JSON first
    try {
      const parsed = JSON.parse(text)
      processPrompts(Array.isArray(parsed) ? parsed : [parsed])
      return
    } catch {}
    // Try CSV
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
        processPrompts(items)
        return
      }
    } catch {}
    setImportError('Could not parse content. Please use valid JSON or CSV format.')
  }

  const resetImport = () => {
    setImportError('')
    setImportSuccess('')
    setPasteText('')
    setImportOpen(false)
  }

  return (
    <div className="mb-8">
      {/* Import Modal */}
      {importOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl w-full max-w-lg p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📥</span>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Import Prompts</h2>
              </div>
              <button onClick={resetImport} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl transition-colors">✕</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
              {[['json', '📄 JSON File'], ['csv', '📊 CSV File'], ['paste', '📋 Paste Text']].map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => { setImportTab(tab); setImportError(''); setImportSuccess('') }}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${importTab === tab ? 'bg-white dark:bg-zinc-700 text-orange-500 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* JSON Tab */}
            {importTab === 'json' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Upload a JSON file. Expected format:</p>
                <pre className="text-xs bg-gray-50 dark:bg-zinc-800 rounded-xl p-3 border border-gray-100 dark:border-zinc-700 text-gray-600 dark:text-gray-400 overflow-x-auto">{`[
  {
    "title": "My Prompt",
    "category": "Writing",
    "prompt": "Your prompt text...",
    "tags": ["tag1", "tag2"]
  }
]`}</pre>
                <input ref={jsonFileRef} type="file" accept=".json" onChange={handleJSONFile} className="hidden" />
                <button
                  onClick={() => jsonFileRef.current.click()}
                  className="w-full py-3 border-2 border-dashed border-orange-300 dark:border-orange-500/40 hover:border-orange-500 rounded-xl text-orange-500 font-semibold text-sm transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-500/5"
                >
                  Click to Upload JSON File
                </button>
              </div>
            )}

            {/* CSV Tab */}
            {importTab === 'csv' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Upload a CSV file. Expected headers:</p>
                <pre className="text-xs bg-gray-50 dark:bg-zinc-800 rounded-xl p-3 border border-gray-100 dark:border-zinc-700 text-gray-600 dark:text-gray-400 overflow-x-auto">{`title,category,prompt,tags
"My Prompt","Writing","Prompt text...","tag1,tag2"`}</pre>
                <input ref={csvFileRef} type="file" accept=".csv" onChange={handleCSVFile} className="hidden" />
                <button
                  onClick={() => csvFileRef.current.click()}
                  className="w-full py-3 border-2 border-dashed border-orange-300 dark:border-orange-500/40 hover:border-orange-500 rounded-xl text-orange-500 font-semibold text-sm transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-500/5"
                >
                  Click to Upload CSV File
                </button>
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
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                />
                <button
                  onClick={handlePasteImport}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-orange-200 dark:shadow-orange-900/30 active:scale-95"
                >
                  Import Prompts
                </button>
              </div>
            )}

            {importError && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl px-4 py-3">
                <span>❌</span>
                <p className="text-xs text-red-600 dark:text-red-400">{importError}</p>
              </div>
            )}

            {importSuccess && (
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-xl px-4 py-3">
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">{importSuccess}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Buttons Row */}
      {!open && (
        <div className="flex gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 py-4 px-6 border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-500/40 rounded-2xl text-gray-400 dark:text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-200">+</span>
            Add Your Own Prompt
          </button>
          <button
            onClick={() => setImportOpen(true)}
            className="py-4 px-6 border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-500/40 rounded-2xl text-gray-400 dark:text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>📥</span>
            Import
          </button>
        </div>
      )}

      {/* Add Prompt Form */}
      {open && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 shadow-xl shadow-gray-100/50 dark:shadow-black/20 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white text-xl">Add New Prompt</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-xl">✕</button>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Title *</label>
              <input
                type="text"
                placeholder="e.g. My Email Writer"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Prompt Text *</label>
              <textarea
                placeholder="Write your prompt here..."
                value={form.prompt}
                onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Tags <span className="normal-case font-normal">(comma separated)</span></label>
              <input
                type="text"
                placeholder="e.g. writing, email, business"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-orange-200 dark:shadow-orange-900/30 hover:shadow-xl active:scale-95"
            >
              Add Prompt
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 py-3 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400 rounded-xl font-bold text-sm transition-all duration-200 border border-gray-100 dark:border-zinc-700 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}