export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center py-20">
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary dark:text-text-primary-dark">
          Fund Your Dreams
        </h1>
        <p className="mt-4 text-lg text-text-muted dark:text-text-muted-dark max-w-2xl mx-auto">
          Join thousands of creators and backers building the future together.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="/explore"
            className="inline-flex items-center justify-center rounded-md bg-brand-green px-6 py-3 text-sm font-medium text-white shadow-xs hover:bg-brand-green-dark transition-colors"
          >
            Explore Campaigns
          </a>
          <a
            href="/register"
            className="inline-flex items-center justify-center rounded-md border border-border-subtle dark:border-border-subtle-dark px-6 py-3 text-sm font-medium text-text-primary dark:text-text-primary-dark hover:bg-muted transition-colors"
          >
            Start a Campaign
          </a>
        </div>
      </section>
    </div>
  )
}
