export default function HeroSection({ promptCount, user, usageStats, favoriteCount = 0, collectionCount = 0, onFavoritesClick, onCollectionsClick }) {
  const totalActions = Object.values(usageStats || {}).reduce((a, b) => a + b, 0)
  const firstName = user?.displayName?.split(' ')[0] || null

  const stats = [
    { value: promptCount, label: 'Prompts' },
    { value: favoriteCount, label: 'Favorites' },
    { value: collectionCount, label: 'Collections' },
    { value: totalActions, label: 'Actions' }
  ]

  return (
    <section className="mb-6 sm:mb-10 pt-4">
      <div className="relative overflow-hidden rounded-[28px] border border-gray-100 bg-white/80 px-4 py-8 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-zinc-900/80 sm:px-8 sm:py-10">
        <div className="absolute inset-0 opacity-80" style={{ background: 'radial-gradient(circle at top left, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 55%)' }} />
        <div className="relative">
          {firstName && (
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Welcome back, <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{firstName}</span> 👋
            </p>
          )}

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
              Prompt workspace
            </span>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Your AI prompts,
                <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}>
                  ready to use.
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                Search, save, remix, and organize your best AI workflows without losing momentum.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={onFavoritesClick} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/8 dark:bg-zinc-900 dark:text-gray-200">
                Favorites only
              </button>
              <button onClick={onCollectionsClick} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/8 dark:bg-zinc-900 dark:text-gray-200">
                View collections
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white/80 p-4 dark:border-white/8 dark:bg-zinc-950/40">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">{stat.label}</span>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)' }} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}