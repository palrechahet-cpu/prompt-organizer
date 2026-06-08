export default function HeroSection({ promptCount, user, usageStats }) {
  const totalActions = Object.values(usageStats || {}).reduce((a, b) => a + b, 0)
  const firstName = user?.displayName?.split(' ')[0] || null

  return (
    <section className="mb-8 sm:mb-16 pt-4">
      <div className="relative text-center py-12 sm:py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-10" style={{ backgroundColor: 'var(--color-primary)' }} />
        <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-5" style={{ backgroundColor: 'var(--color-primary)' }} />
        <div className="absolute top-10 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-5" style={{ backgroundColor: 'var(--color-secondary)' }} />

        {/* Personalized greeting */}
        {firstName && (
          <p className="relative text-sm text-gray-400 dark:text-gray-500 mb-3 animate-fade-in">
            Welcome back, <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{firstName}</span> 👋
          </p>
        )}

        <div className="relative inline-flex items-center gap-2 px-4 py-1.5 border rounded-full text-xs font-semibold mb-6 backdrop-blur-sm animate-fade-in"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)', color: 'var(--color-primary)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }} />
          AI Prompt Management Platform
        </div>

        <h1 className="relative text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-5 leading-tight tracking-tight animate-slide-in-down">
          Your AI Prompts,{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}>
            Organized
          </span>
        </h1>

        <p className="relative text-gray-500 dark:text-gray-400 text-base sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in">
          Discover, save, and reuse expert AI prompts.
          <br className="hidden sm:block" />
          Stop losing your best workflows forever.
        </p>

        <div className="relative flex items-center justify-center gap-4 sm:gap-8 animate-slide-in-up">
          {[
            { value: promptCount, label: 'Prompts' },
            { value: Object.keys(usageStats || {}).length, label: 'Prompts Used' },
            { value: totalActions, label: 'Total Actions' },
            { value: '∞', label: 'Possibilities' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center px-4 sm:px-6 py-3 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/10 rounded-2xl">
              <span className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}>
                {stat.value}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}