import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bike, UtensilsCrossed, Package, Home, User, History, Wallet, LogOut,
  ChevronRight, Menu, X, Shield, Smartphone
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/app', icon: Home, label: 'Accueil', end: true },
  { to: '/app/ride', icon: Bike, label: 'Course' },
  { to: '/app/food', icon: UtensilsCrossed, label: 'Repas' },
  { to: '/app/parcel', icon: Package, label: 'Colis' },
  { to: '/app/history', icon: History, label: 'Activité' },
  { to: '/app/profile', icon: User, label: 'Profil' },
]

const BOTTOM_NAV = [
  { to: '/app', icon: Home, label: 'Accueil', end: true },
  { to: '/app/ride', icon: Bike, label: 'Course' },
  { to: '/app/food', icon: UtensilsCrossed, label: 'Repas' },
  { to: '/app/parcel', icon: Package, label: 'Colis' },
  { to: '/app/history', icon: History, label: 'Activité' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile header */}
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed top-0 left-0 right-0 bg-moov-500 text-white px-4 pt-5 pb-3 z-40"
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <h1 className="text-lg font-bold">Moov' Togo</h1>
            <p className="text-[10px] opacity-80">{user?.name || 'Bienvenue'} · {user?.walletBalance?.toLocaleString() || 0} FCFA</p>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="btn btn-ghost btn-sm text-white lg:hidden">
            <Menu size={20} />
          </button>
        </div>
      </motion.header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 z-30">
        <div className="bg-moov-500 text-white p-6">
          <h1 className="text-2xl font-extrabold">Moov'</h1>
          <p className="text-sm opacity-80">Togo</p>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-moov-100 text-moov-500 flex items-center justify-center shrink-0">
            <User size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name || 'Utilisateur'}</p>
            <p className="text-xs text-gray-400">+228 {user?.phone || '---'}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => {
            const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to} to={to} end={end}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-moov-500 text-white shadow-md shadow-moov-500/20 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </NavLink>
            )
          })}
        </nav>

        <div className="px-3 pb-4 space-y-1 border-t border-gray-100 pt-3">
          <NavLink to="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-all">
            <Shield size={18} /> Admin
          </NavLink>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-moov-500 text-white p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Moov' Togo</h2>
                  <p className="text-xs opacity-80">{user?.name} · {user?.walletBalance?.toLocaleString()} FCFA</p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="btn btn-ghost btn-sm text-white">
                  <X size={20} />
                </button>
              </div>

              <nav className="p-4 space-y-1">
                {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => {
                  const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
                  return (
                    <NavLink
                      key={to} to={to} end={end}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        isActive ? 'bg-moov-500 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={18} /> {label}
                    </NavLink>
                  )
                })}
                <hr className="my-3" />
                <NavLink to="/admin" onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-100"
                >
                  <Shield size={18} /> Admin
                </NavLink>
                <button onClick={() => { logout(); setSidebarOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut size={18} /> Déconnexion
                </button>
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 pt-16 lg:pt-8 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-2">
        <div className="max-w-lg mx-auto flex justify-around py-1">
          {BOTTOM_NAV.map(({ to, icon: Icon, label, end }) => {
            const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <NavLink key={to} to={to} end={end}
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors relative ${
                  isActive ? 'text-moov-500' : 'text-gray-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-moov-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <Icon size={20} />
                <span className="text-[10px] font-medium mt-0.5">{label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Desktop wallet bar */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ml-64">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-end gap-4 text-sm">
          <span className="text-gray-400">Solde</span>
          <span className="font-bold text-moov-500">{user?.walletBalance?.toLocaleString() || 0} FCFA</span>
          <NavLink to="/app/payment" className="btn btn-moov btn-xs gap-1">
            <Wallet size={14} /> Recharger
          </NavLink>
        </div>
      </div>
    </div>
  )
}
