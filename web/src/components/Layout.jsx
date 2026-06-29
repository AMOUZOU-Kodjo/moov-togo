import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bike, UtensilsCrossed, Package, Home, User, History, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/app', icon: Home, label: 'Accueil', end: true },
  { to: '/app/ride', icon: Bike, label: 'Course' },
  { to: '/app/food', icon: UtensilsCrossed, label: 'Repas' },
  { to: '/app/parcel', icon: Package, label: 'Colis' },
  { to: '/app/history', icon: History, label: 'Activité' },
  { to: '/app/profile', icon: User, label: 'Profil' },
]

export default function Layout() {
  const { user } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="bg-moov-500 text-white px-4 pt-6 pb-4 rounded-b-3xl"
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold"
            >
              Moov' Togo
            </motion.h1>
            <p className="text-xs opacity-80">
              {user?.name || 'Bienvenue'} · {user?.walletBalance?.toLocaleString() || 0} FCFA
            </p>
          </div>
          <NavLink to="/app/payment" className="btn btn-ghost btn-sm text-white gap-1">
            <Wallet size={16} />
            <motion.span
              key={user?.walletBalance}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-xs"
            >
              {user?.walletBalance?.toLocaleString() || 0}
            </motion.span>
          </NavLink>
        </div>
      </motion.header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-2">
        <div className="max-w-lg mx-auto flex justify-around py-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => {
            const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <NavLink key={to} to={to} end={end}
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors relative ${
                  isActive ? 'text-moov-500' : 'text-gray-400 hover:text-gray-600'
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
    </div>
  )
}
