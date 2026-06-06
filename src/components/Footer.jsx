export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 dark:border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="text-white font-bold">✦</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">AI Prompt Studio</p>
              <p className="text-xs" style={{ color: 'var(--color-primary)' }}>by Het Palrecha</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
            Built with React & Tailwind CSS · Your prompts, your workflow
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>Made with</span>
            <span className="text-sm" style={{ color: 'var(--color-primary)' }}>♥</span>
            <span>for AI users</span>
          </div>
        </div>
      </div>
    </footer>
  )
}