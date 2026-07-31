"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck } from "lucide-react"
import { Link } from "react-router-dom"

interface NotificationItem {
  _id: string
  message: string
  toEmail: string
  actionRoute: string
  time: string
  read: boolean
}

export function NotificationBell() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    if (!user) return
    try {
      const data = await api.get<NotificationItem[]>(`/api/notifications/${user.email}`)
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.read).length)
    } catch {
      // silent fail
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleMarkAllRead = async () => {
    for (const n of notifications) {
      if (!n.read) {
        try {
          await api.patch(`/api/notifications/${n._id}/read`, {})
        } catch {
          // silent fail
        }
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return new Date(iso).toLocaleDateString()
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-bg-card dark:bg-bg-card-dark border border-border-subtle dark:border-border-subtle-dark rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border-subtle dark:border-border-subtle-dark">
            <span className="font-heading text-sm font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-brand-green hover:underline flex items-center gap-1"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-text-muted dark:text-text-muted-dark">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  to={n.actionRoute}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 text-sm border-b border-border-subtle dark:border-border-subtle-dark last:border-0 hover:bg-muted dark:hover:bg-muted/50 transition-colors ${n.read ? "" : "bg-brand-green/5 dark:bg-brand-green/10"}`}
                >
                  <p className="text-text-primary dark:text-text-primary-dark">{n.message}</p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">
                    {formatTime(n.time)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}