export default function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold">✦</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Prompt Organizer</h3>
                <p className="text-xs text-gray-400">AI Workflow Platform</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Build your personal AI prompt library and boost productivity.</p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-white mb-3">Features</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>✓ Save & organize prompts</li>
              <li>✓ 18+ built-in templates</li>
              <li>✓ One-click copy</li>
              <li>✓ Search & filter</li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-3">Categories</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>📚 Research</li>
              <li>✍️ Writing</li>
              <li>🎓 Education</li>
              <li>⚡ Productivity</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-semibold text-white mb-3">Built with</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>⚛️ React 19</li>
              <li>🎨 Tailwind CSS</li>
              <li>⚡ Vite</li>
              <li>💾 LocalStorage</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div>
              <p>© 2024 Prompt Organizer. Built for productivity.</p>
              <p className="text-xs text-gray-500 mt-2">Created by <span className="font-semibold text-gray-300">Het Palrecha</span></p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Feedback</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
