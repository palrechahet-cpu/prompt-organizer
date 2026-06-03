export default function HeroSection({ promptCount }) {
  return (
    <section className="mb-8 sm:mb-16 pt-4">
      <div className="relative text-center py-12 sm:py-20 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-semibold mb-6 backdrop-blur-sm animate-fade-in">
          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
          AI Prompt Management Platform
        </div>

        {/* Headline */}
        <h1 className="relative text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-5 leading-tight tracking-tight animate-slide-in-down">
          Your AI Prompts,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400">
            Organized
          </span>
        </h1>

        {/* Subheading */}
        <p className="relative text-gray-500 dark:text-gray-400 text-base sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in">
          Discover, save, and reuse expert AI prompts.
          <br className="hidden sm:block" />
          Stop losing your best workflows forever.
        </p>

        {/* Stats */}
        <div className="relative flex items-center justify-center gap-4 sm:gap-8 animate-slide-in-up">
          {[
            { value: promptCount, label: 'Prompts' },
            { value: '10', label: 'Categories' },
            { value: '∞', label: 'Possibilities' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center px-4 sm:px-6 py-3 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/10 rounded-2xl">
              <span className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">{stat.value}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}