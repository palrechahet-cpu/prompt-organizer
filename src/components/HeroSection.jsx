export default function HeroSection({ totalPrompts, totalFavorites }) {
  return (
    <section className="mb-8 sm:mb-10 rounded-lg sm:rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-4 sm:px-8 py-8 sm:py-12 text-white">
        <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Welcome to Prompt Organizer</h1>
        <p className="text-blue-100 text-sm sm:text-lg mb-4 sm:mb-6">
          Your personal AI prompt library. Discover, customize, and organize expert prompts for any task.
        </p>
        <div className="flex gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">📌</span>
            <div>
              <div className="text-xl sm:text-2xl font-bold">{totalPrompts}</div>
              <div className="text-blue-100 text-xs sm:text-sm">Total Prompts</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">⭐</span>
            <div>
              <div className="text-xl sm:text-2xl font-bold">{totalFavorites}</div>
              <div className="text-blue-100 text-xs sm:text-sm">Saved Favorites</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
