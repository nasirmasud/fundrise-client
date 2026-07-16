import { Link, Outlet, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/dashboard", roles: ["creator", "supporter", "admin"] },
  { label: "My Campaigns", href: "/dashboard/campaigns", roles: ["creator"] },
  { label: "My Contributions", href: "/dashboard/contributions", roles: ["supporter"] },
  { label: "Purchase Credits", href: "/dashboard/credits", roles: ["supporter"] },
  { label: "Withdraw", href: "/dashboard/withdraw", roles: ["creator"] },
  { label: "Admin", href: "/dashboard/admin", roles: ["admin"] },
]

export function DashboardLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border-subtle dark:border-border-subtle-dark bg-bg-card dark:bg-bg-card-dark">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <Link to="/dashboard" className="font-heading text-xl font-bold text-brand-green">
            FundRise
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted dark:text-text-muted-dark">Dashboard</span>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
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
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
