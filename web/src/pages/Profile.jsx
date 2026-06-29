import { User, Star, CreditCard, Gift, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()

  const MENU = [
    { icon: CreditCard, label: 'Moyens de paiement' },
    { icon: Gift, label: 'Parrainer un ami' },
    { icon: HelpCircle, label: 'Aide & Support' },
  ]

  return (
    <div className="space-y-4">
      <div className="card-moov text-center">
        <div className="w-20 h-20 rounded-full bg-moov-100 text-moov-500 flex items-center justify-center mx-auto mb-3">
          <User size={36} />
        </div>
        <h2 className="font-bold text-xl">{user?.name || 'Utilisateur Moov\''}</h2>
        <p className="text-sm text-gray-400">+228 {user?.phone}</p>
        <div className="badge badge-moov gap-1 mt-2">
          <Star size={12} /> {user?.rating?.toFixed(1) || '0.0'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { value: user?.rideCount || 0, label: 'Courses' },
          { value: user?.deliveryCount || 0, label: 'Livraisons' },
          { value: (user?.walletBalance || 0).toLocaleString(), label: 'FCFA' },
        ].map(s => (
          <div key={s.label} className="card bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card-moov p-0 divide-y">
        {MENU.map(({ icon: Icon, label }) => (
          <button key={label} className="flex items-center gap-3 p-4 w-full text-left hover:bg-gray-50 transition-colors">
            <Icon size={18} className="text-gray-400" />
            <span className="flex-1 text-sm font-medium">{label}</span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      <button onClick={logout} className="btn btn-outline border-red-300 text-red-500 hover:bg-red-500 hover:text-white w-full rounded-xl gap-2">
        <LogOut size={16} /> Se déconnecter
      </button>
    </div>
  )
}
