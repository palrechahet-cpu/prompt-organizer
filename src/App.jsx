import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturedSection from './components/FeaturedSection'
import CategoriesSection from './components/CategoriesSection'
import AddPromptForm from './components/AddPromptForm'
import PromptCard from './components/PromptCard'
import Footer from './components/Footer'
import Toast from './components/Toast'
import defaultPrompts from './data/prompts'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') !== 'false'
  })

  const [prompts, setPrompts] = useState(() => {
    const saved = localStorage.getItem('prompts')
    return saved ? JSON.parse(saved) : defaultPrompts
  })

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts))
  }, [prompts])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const toggleFavorite = (id) => {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p))
  }

  const copyPrompt = (text) => {
    navigator.clipboard.writeText(text)
    showToast('Prompt copied!')
  }

  const addPrompt = (newPrompt) => {
    setPrompts(prev => [...prev, { ...newPrompt, id: Date.now(), favorite: false }])
    showToast('Prompt added!')
  }

  const deletePrompt = (id) => {
    setPrompts(prev => prev.filter(p => p.id !== id))
    showToast('Prompt deleted!')
  }

  const categories = ['All', ...new Set(prompts.map(p => p.category))]

  const filtered = prompts.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      p.prompt?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesFav = !showFavoritesOnly || p.favorite
    return matchesSearch && matchesCategory && matchesFav
  })

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
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <HeroSection promptCount={prompts.length} />
          <FeaturedSection
            prompts={prompts}
            onCopy={copyPrompt}
            onFavorite={toggleFavorite}
            onDelete={deletePrompt}
          />
          <CategoriesSection
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
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
                <PromptCard
                  key={p.id}
                  prompt={p}
                  onFavorite={() => toggleFavorite(p.id)}
                  onCopy={() => copyPrompt(p.prompt)}
                  onDelete={() => deletePrompt(p.id)}
                />
              ))
            )}
          </div>
        </main>
        <Footer />
        {toast && <Toast message={toast} />}
      </div>
    </div>
  )
}

export default App