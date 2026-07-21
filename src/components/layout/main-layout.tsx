import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Loader2, Moon, Sun, LogOut, Menu, X, User } from "lucide-react"
import toast from "react-hot-toast"

export function MainLayout() {
  const { user, loading, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out")
      navigate("/")
    } catch {
      toast.error("Failed to log out")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border-subtle dark:border-border-subtle-dark bg-bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="font-heading text-xl font-bold text-brand-green">
            FundRise
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/explore"
              className="text-sm text-text-muted hover:text-text-primary dark:text-text-muted-dark dark:hover:text-text-primary-dark transition-colors"
            >
              Explore
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-text-muted hover:text-text-primary dark:text-text-muted-dark dark:hover:text-text-primary-dark transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary dark:text-text-muted-dark dark:hover:text-text-primary-dark transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-brand-green/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-brand-green" />
                    </div>
                  )}
                  <span className="hidden lg:inline">{user.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-brand-green hover:text-brand-green-dark transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-md bg-brand-green px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-brand-green-dark transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-text-muted hover:text-text-primary dark:text-text-muted-dark"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border-subtle dark:border-border-subtle-dark bg-bg-card dark:bg-bg-card-dark px-4 py-4 space-y-3">
            <Link
              to="/explore"
              className="block text-sm text-text-muted hover:text-text-primary dark:text-text-muted-dark dark:hover:text-text-primary-dark"
              onClick={() => setMobileOpen(false)}
            >
              Explore
            </Link>
            <button
              onClick={() => { toggleTheme(); setMobileOpen(false) }}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary dark:text-text-muted-dark dark:hover:text-text-primary-dark"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
            ) : user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-sm text-text-muted hover:text-text-primary dark:text-text-muted-dark dark:hover:text-text-primary-dark"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-sm font-medium text-brand-green"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-sm font-medium text-brand-green"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle dark:border-border-subtle-dark bg-bg-card dark:bg-bg-card-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <Link to="/" className="font-heading text-xl font-bold text-brand-green">
                FundRise
              </Link>
              <p className="mt-2 text-sm text-text-muted dark:text-text-muted-dark">
                Empowering creators and supporters to build the future together.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-heading text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-3">
                Platform
              </h3>
              <ul className="space-y-2 text-sm text-text-muted dark:text-text-muted-dark">
                <li>
                  <Link to="/explore" className="hover:text-text-primary dark:hover:text-text-primary-dark transition-colors">
                    Explore Campaigns
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-text-primary dark:hover:text-text-primary-dark transition-colors">
                    Start a Campaign
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-heading text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-3">
                Connect
              </h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-brand-green dark:text-text-muted-dark dark:hover:text-brand-green transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-brand-green dark:text-text-muted-dark dark:hover:text-brand-green transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-brand-green dark:text-text-muted-dark dark:hover:text-brand-green transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border-subtle dark:border-border-subtle-dark text-center text-xs text-text-muted dark:text-text-muted-dark">
            &copy; {new Date().getFullYear()} FundRise. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
