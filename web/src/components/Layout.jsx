import { Outlet, NavLink, useLocation } from 'react-router-dom'
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
  const { user, logout } = useAuth()
  const location = useLocation()
  const isDriver = user?.role === 'DRIVER'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-moov-500 text-white px-4 pt-6 pb-4 rounded-b-3xl">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <h1 className="text-xl font-bold">Moov' Togo</h1>
            <p className="text-xs opacity-80">
              {user?.name || 'Bienvenue'} · {user?.walletBalance?.toLocaleString() || 0} FCFA
            </p>
          </div>
          <NavLink to="/app/payment" className="btn btn-ghost btn-sm text-white gap-1">
            <Wallet size={16} />
            <span className="text-xs">{user?.walletBalance?.toLocaleString() || 0}</span>
          </NavLink>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => {
            const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <NavLink key={to} to={to} end={end}
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors ${
                  isActive ? 'text-moov-500' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
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
