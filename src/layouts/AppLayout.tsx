import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Fish, Users, ClipboardList, ShoppingCart, BookOpen,
  Megaphone, BarChart3, Settings, Menu, X, ChevronDown, LogOut,
  Droplets, RefreshCw, WifiOff, Bell,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import { logoutStaff } from '@/services/authService'
import { syncNow } from '@/services/syncService'

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/submissions', icon: Fish, label: 'Submissions' },
  { to: '/app/collections', icon: ClipboardList, label: 'Collections' },
  { to: '/app/farmers', icon: Users, label: 'Farmers' },
  { to: '/app/enquiries', icon: Megaphone, label: 'Enquiries' },
  { to: '/app/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/app/training', icon: BookOpen, label: 'Training' },
  { to: '/app/pricing', icon: BarChart3, label: 'Pricing' },
  { to: '/app/reports', icon: BarChart3, label: 'Reports' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
]

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isStaff } = useAuthStore()
  const { isOnline, isSyncing, pendingSyncCount } = useAppStore()

  if (!isStaff) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <Link to="/app" className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-aqua-500" />
              <span className="font-bold text-navy-900 hidden sm:inline">Agrimarine</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {!isOnline && (
              <span className="flex items-center gap-1 text-xs text-yellow-600">
                <WifiOff className="h-3.5 w-3.5" /> Offline
              </span>
            )}
            {pendingSyncCount > 0 && (
              <button
                onClick={() => syncNow()}
                disabled={isSyncing}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : `${pendingSyncCount}`}
              </button>
            )}
            <Link to="/app/notifications" className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-7 h-7 rounded-full bg-aqua-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.displayName?.charAt(0) || 'S'}
                </div>
                <span className="text-sm text-gray-700 hidden sm:inline">{user?.displayName}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-20">
                    <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                      {user?.email}
                    </div>
                    <Link
                      to="/"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Public Site
                    </Link>
                    <button
                      onClick={() => { logoutStaff(); setUserMenuOpen(false) }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`fixed lg:sticky top-14 lg:top-14 left-0 z-20 w-60 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="flex items-center justify-between p-3 border-b border-gray-100 lg:hidden">
            <span className="font-semibold text-navy-900">Navigation</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="p-2 space-y-0.5 overflow-y-auto h-full pb-8">
            {navItems.map((item) => {
              const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-aqua-50 text-aqua-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
