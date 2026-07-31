import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, Moon, Sun, Menu, X, User } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { NotificationBell } from "@/components/notification-bell"

const navConfig: Record<string, { label: string; href: string }[]> = {
  supporter: [
    { label: "Home", href: "/dashboard" },
    { label: "Explore Campaigns", href: "/dashboard/explore-campaigns" },
    { label: "My Contributions", href: "/dashboard/my-contributions" },
    { label: "Purchase Credits", href: "/dashboard/purchase-credit" },
    { label: "Payment History", href: "/dashboard/payment-history" },
  ],
  creator: [
    { label: "Home", href: "/dashboard" },
    { label: "Review Contributions", href: "/dashboard/review-contributions" },
    { label: "Add Campaign", href: "/dashboard/add-campaign" },
    { label: "My Campaigns", href: "/dashboard/my-campaigns" },
    { label: "Withdrawals", href: "/dashboard/withdrawals" },
    { label: "Payment History", href: "/dashboard/creator-payment-history" },
  ],
  admin: [
    { label: "Home", href: "/dashboard" },
    { label: "Manage Users", href: "/dashboard/manage-users" },
    { label: "Manage Campaigns", href: "/dashboard/manage-campaigns" },
    { label: "Withdrawal Requests", href: "/dashboard/withdrawal-requests" },
    { label: "Reports", href: "/dashboard/reports" },
  ],
}

export function DashboardLayout() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = user ? navConfig[user.role] ?? [] : []

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
      {/* Top bar */}
      <header className="border-b border-border-subtle dark:border-border-subtle-dark bg-bg-card dark:bg-bg-card-dark sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-md text-text-muted hover:text-text-primary dark:text-text-muted-dark"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/" className="font-heading text-xl font-bold text-brand-green">
              FundRise
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark">
                <span className="font-medium text-text-primary dark:text-text-primary-dark">
                  {user.credits} credits
                </span>
                <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green font-medium">
                  {user.role}
                </span>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-text-muted hover:text-text-primary dark:text-text-muted-dark dark:hover:text-text-primary-dark transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <NotificationBell />

            {user && (
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand-green/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-brand-green" />
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — desktop */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border-subtle dark:border-border-subtle-dark bg-bg-card dark:bg-bg-card-dark p-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-brand-green/10 text-brand-green"
                    : "text-text-muted hover:text-text-primary hover:bg-muted dark:text-text-muted-dark dark:hover:text-text-primary-dark"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Sidebar — mobile overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="relative w-64 flex flex-col bg-bg-card dark:bg-bg-card-dark border-r border-border-subtle dark:border-border-subtle-dark p-4">
              <nav className="flex flex-col gap-1 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-brand-green/10 text-brand-green"
                        : "text-text-muted hover:text-text-primary hover:bg-muted dark:text-text-muted-dark dark:hover:text-text-primary-dark"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
