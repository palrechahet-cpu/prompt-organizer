import { useState, useEffect } from 'react'

const steps = [
  {
    title: "Welcome to AI Prompt Studio! 🎯",
    description: "Your personal library of powerful AI prompts. Let's take a quick tour to show you everything!",
    emoji: "👋",
    position: "center"
  },
  {
    title: "Search Anything 🔍",
    description: "Type in the search bar to instantly find prompts by title, tag, or content.",
    emoji: "🔍",
    highlight: "search",
    position: "top"
  },
  {
    title: "Filter by Category 📂",
    description: "Browse prompts by category — Writing, Coding, Creative, and more!",
    emoji: "📂",
    highlight: "categories",
    position: "top"
  },
  {
    title: "Save Your Favorites ★",
    description: "Click the star on any prompt card to save it. Then filter by Favorites to find them instantly.",
    emoji: "⭐",
    highlight: "favorites",
    position: "top"
  },
  {
    title: "Add Your Own Prompts ✍️",
    description: "Scroll down to the Add Prompt form and create your own custom prompts anytime.",
    emoji: "✍️",
    position: "center"
  },
  {
    title: "You're all set! 🚀",
    description: "Start exploring your prompt library. Copy, favorite, and share prompts with anyone!",
    emoji: "🚀",
    position: "center"
  }
]

export default function OnboardingTour({ onFinish }) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  const current = steps[step]
  const isLast = step === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      setVisible(false)
      setTimeout(onFinish, 300)
    } else {
      setStep(s => s + 1)
    }
  }

  const handleSkip = () => {
    setVisible(false)
    setTimeout(onFinish, 300)
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl p-8 flex flex-col gap-6">
        
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${i === step ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-gray-200 dark:bg-zinc-700'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-5xl">{current.emoji}</span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{current.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{current.description}</p>
        </div>

        {/* Step counter */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600">
          Step {step + 1} of {steps.length}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all duration-200"
          >
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-sm active:scale-95"
          >
            {isLast ? '🚀 Get Started' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
