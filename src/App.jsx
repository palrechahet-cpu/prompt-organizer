import { useEffect, useMemo, useState } from 'react'
import promptsData from './data/prompts'
import PromptCard from './components/PromptCard'
import Navbar from './components/Navbar'
import FeaturedSection from './components/FeaturedSection'
import CategoriesSection from './components/CategoriesSection'
import HeroSection from './components/HeroSection'
import Toast from './components/Toast'
import Footer from './components/Footer'

function App() {
  const [prompts, setPrompts] = useState(() => {
    try {
      const raw = localStorage.getItem('prompts')
      return raw ? JSON.parse(raw) : promptsData
    } catch {
      return promptsData
    }
  })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showFavorites, setShowFavorites] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts))
  }, [prompts])

  const categories = useMemo(() => {
    const s = new Set(prompts.map(p => p.category))
    return ['All', ...Array.from(s)]
  }, [prompts])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return prompts.filter(p => {
      if (showFavorites && !p.favorite) return false
      if (category !== 'All' && p.category !== category) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.tags.join(' ').toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q)
      )
    })
  }, [prompts, search, category, showFavorites])

  function toggleFavorite(id) {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p))
  }

  function handleCopy(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setToast({ message: '✓ Copied to clipboard!', type: 'success' })
    }
  }

  function handleDelete(id) {
    setPrompts(prev => prev.filter(p => p.id !== id))
    setToast({ message: '✓ Prompt deleted', type: 'success' })
  }

  function handleAdd(e) {
    e.preventDefault()
    const form = e.target
    const title = form.title.value.trim()
    const category = form.category.value.trim() || 'Custom'
    const tags = form.tags.value.split(',').map(t => t.trim()).filter(Boolean)
    const prompt = form.prompt.value.trim()
    if (!title || !prompt) return
    const newPrompt = {
      id: Date.now(),
      title,
      category,
      tags,
      prompt,
      favorite: false,
      builtIn: false
    }
    setPrompts(prev => [newPrompt, ...prev])
    form.reset()
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar
        search={search}
        onSearchChange={setSearch}
        showFavorites={showFavorites}
        onFavoritesToggle={() => setShowFavorites(s => !s)}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 animate-fade-in">
        {/* Hero Section */}
        <div className="animate-slide-in-down">
          <HeroSection
            totalPrompts={prompts.length}
            totalFavorites={prompts.filter(p => p.favorite).length}
          />
        </div>

        {/* Featured Section */}
        <div className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <FeaturedSection
            prompts={prompts}
            onFavorite={toggleFavorite}
            onCopy={handleCopy}
            onDelete={handleDelete}
          />
        </div>

        {/* Categories Section */}
        <div className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          <CategoriesSection
            categories={categories}
            activeCategory={category}
            onCategoryChange={setCategory}
          />
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 animate-slide-in-up" style={{ animationDelay: '300ms' }}>
          {/* Prompts Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Browse All Prompts</h2>
              <p className="text-xs sm:text-base text-gray-600 mt-1">
                {filtered.length} of {prompts.length} prompts
                {showFavorites && ' (Favorites only)'}
                {category !== 'All' && ` in ${category}`}
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {filtered.map((p, idx) => (
                  <div key={p.id} className="animate-scale-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <PromptCard
                      prompt={p}
                      onFavorite={() => toggleFavorite(p.id)}
                      onCopy={() => handleCopy(p.prompt)}
                      onDelete={() => handleDelete(p.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 bg-white rounded-lg border border-gray-200 animate-fade-in">
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🔍</div>
                <p className="text-gray-600 text-base sm:text-lg font-medium">No prompts found</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {showFavorites
                    ? "You haven't favorited any prompts yet"
                    : 'Try adjusting your search or category filters'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Add Prompt Form */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
              <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                <span>✨</span> <span className="hidden sm:inline">Create</span> Prompt
              </h3>
              <form onSubmit={handleAdd} className="flex flex-col gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Title</label>
                  <input
                    name="title"
                    placeholder="e.g. Code Reviewer"
                    className="w-full px-2.5 sm:px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Category</label>
                  <input
                    name="category"
                    placeholder="e.g. Development"
                    className="w-full px-2.5 sm:px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Tags</label>
                  <input
                    name="tags"
                    placeholder="comma, separated"
                    className="w-full px-2.5 sm:px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Prompt</label>
                  <textarea
                    name="prompt"
                    placeholder="Enter your prompt..."
                    rows={4}
                    className="w-full px-2.5 sm:px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                  />
                </div>
                <button className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition transform hover:scale-105 active:scale-95 text-xs sm:text-sm">
                  + Add Prompt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setCategory('All')
                    setShowFavorites(false)
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition text-xs sm:text-sm"
                >
                  Reset All
                </button>
              </form>
            </div>
          </aside>
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App