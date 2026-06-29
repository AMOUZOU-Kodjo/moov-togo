import { Link } from 'react-router-dom'
import { Bike, UtensilsCrossed, Package, Gift, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const SERVICES = [
  { to: '/app/ride', icon: Bike, label: 'Course', desc: 'Zémidjan / Taxi', color: 'bg-secondary text-white' },
  { to: '/app/food', icon: UtensilsCrossed, label: 'Repas', desc: 'Livraison cantines', color: 'bg-moov-500 text-white' },
  { to: '/app/parcel', icon: Package, label: 'Colis', desc: 'Envoi inter-ville', color: 'bg-accent text-white' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="card-moov">
        <h2 className="text-lg font-bold mb-1">
          Bonjour {user?.name || '👋'}
        </h2>
        <p className="text-gray-500 text-sm">Prêt à rouler ?</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SERVICES.map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to} className="card bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className={`p-3 rounded-xl ${color} mb-2`}>
              <Icon size={24} />
            </div>
            <span className="font-bold text-sm">{label}</span>
            <span className="text-[10px] text-gray-400">{desc}</span>
          </Link>
        ))}
      </div>

      <div className="card bg-secondary text-white rounded-2xl p-5 shadow-md">
        <div className="flex items-start gap-3">
          <Gift size={24} className="shrink-0" />
          <div>
            <h3 className="font-bold">Premier trajet offert</h3>
            <p className="text-sm opacity-90">Code <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-xs">MOOV1</span></p>
          </div>
        </div>
      </div>

      <div className="card-moov flex items-center justify-between">
        <div>
          <h3 className="font-bold">Activité récente</h3>
          <p className="text-sm text-gray-400">Aucune pour le moment</p>
        </div>
        <Link to="/app/history" className="btn btn-ghost btn-sm text-moov-500">
          Voir <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
