// components/dashboard/Sidebar.tsx (partial update)
'use client'

import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  Home,
  PieChart,
  Bell,
  HelpCircle,
  ChevronDown,
  User,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Deposit', href: '/dashboard/deposit', icon: DollarSign },
  { name: 'Investment', href: '/dashboard/investment', icon: TrendingUp },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Withdrawal', href: '/dashboard/withdrawal', icon: Wallet },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardSidebar({
  user,
  openLogoutModal
}: {
  user: any,
  openLogoutModal: () => void
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  // Mock user data
  const userData = {
    name: user?.user_metadata?.full_name || 'Investor',
    email: user?.email,
    plan: 'Growth',
    balance: 25430.50,
    avatar: user?.user_metadata?.avatar_url || null
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-linear-to-br from-blue-700 to-blue-900 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 backdrop-blur-md bg-black/5"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:sticky inset-y-0 left-0 z-50
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 h-screen flex flex-col
        bg-linear-to-b from-blue-900 to-blue-950
        shadow-xl
      `}>
        {/* Close Button (Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white hover:text-blue-200"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">WealthBridge</h1>
              <p className="text-xs text-blue-300">Investment Platform</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="h-12 w-12 rounded-full border-2 border-white/30"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {userData.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{userData.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-blue-800/50 text-blue-200 rounded-full border border-blue-700">
                  {userData.plan} Plan
                </span>
              </div>
              <p className="text-xs text-blue-300 truncate mt-1">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-lg transition-all group ${isActive
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <div className={`relative ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'}`}>
                  <item.icon className="h-5 w-5" />
                  {isActive && (
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                      <ChevronRight className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <span className="font-medium ml-3">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Balance & Quick Actions */}
        <div className="p-4 border-t border-blue-800">
          <div className="mb-4 bg-blue-800/30 backdrop-blur-sm rounded-xl p-4 border border-blue-700/50">
            <p className="text-sm text-blue-300 mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-white">
              ${userData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Link
                href="/dashboard/deposit"
                className="bg-linear-to-r from-blue-500 to-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg text-center hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Deposit
              </Link>
              <Link
                href="/dashboard/withdrawal"
                className="bg-white/10 backdrop-blur-sm text-white text-sm font-medium py-2 px-3 rounded-lg text-center hover:bg-white/20 transition-all border border-white/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Withdraw
              </Link>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between">
            <button
              className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-400 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-blue-800/90 backdrop-blur-sm rounded-lg shadow-xl border border-blue-700/50 p-2">
                  <div className="text-xs text-blue-300 px-2 py-1">No new notifications</div>
                </div>
              )}
            </div>

            <button
              onClick={openLogoutModal}
              className="flex items-center text-sm text-blue-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <LogOut className="h-4 w-4 mr-1 group-hover:rotate-180 transition-transform duration-300" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>
      </div>

      {/* Add padding to main content for mobile */}
      <style jsx>{`
        @media (max-width: 1023px) {
          :global(main) {
            padding-top: 60px;
          }
        }
      `}</style>
    </>
  )
}