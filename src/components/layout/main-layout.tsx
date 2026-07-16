import { Link, Outlet } from "react-router-dom"

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border-subtle dark:border-border-subtle-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="font-heading text-xl font-bold text-brand-green">
            FundRise
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-sm text-text-muted hover:text-text-primary dark:text-text-muted-dark dark:hover:text-text-primary-dark transition-colors">
              Explore
            </Link>
            <Link to="/login" className="text-sm font-medium text-brand-green hover:text-brand-green-dark transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-md bg-brand-green px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-brand-green-dark transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border-subtle dark:border-border-subtle-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-text-muted dark:text-text-muted-dark">
          &copy; {new Date().getFullYear()} FundRise. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
