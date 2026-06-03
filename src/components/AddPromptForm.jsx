import { useState } from 'react'

export default function AddPromptForm({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Writing', prompt: '', tags: '' })

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

  return (
    <div className="mb-8">
      {open === false ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-4 px-6 border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-500/40 rounded-2xl text-gray-400 dark:text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <span className="text-2xl group-hover:rotate-90 transition-transform duration-200">+</span>
          Add Your Own Prompt
        </button>
      ) : (
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