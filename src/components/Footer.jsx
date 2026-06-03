export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-400 rounded-lg flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
              <span className="text-white font-bold">✦</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">AI Prompt Studio</p>
              <p className="text-xs text-gray-400">by Het Palrecha</p>
            </div>
          </div>

          {/* Center */}
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
            Built with React & Tailwind CSS · Your prompts, your workflow
          </p>

          {/* Right */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>Made with</span>
            <span className="text-orange-400 text-sm">♥</span>
            <span>for AI users</span>
          </div>

        </div>
      </div>
    </footer>
  )
}