import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bike, UtensilsCrossed, Package, Gift, ArrowRight, Navigation, History as HistoryIcon, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useGeolocation from '../hooks/useGeolocation'

const SERVICES = [
  { to: '/app/ride', icon: Bike, label: 'Course', desc: 'Zémidjan / Taxi', color: 'from-secondary to-orange-500', bg: 'bg-secondary' },
  { to: '/app/food', icon: UtensilsCrossed, label: 'Repas', desc: 'Livraison cantines', color: 'from-moov-500 to-green-600', bg: 'bg-moov-500' },
  { to: '/app/parcel', icon: Package, label: 'Colis', desc: 'Envoi inter-ville', color: 'from-accent to-blue-600', bg: 'bg-accent' },
]

export default function Home() {
  const { user } = useAuth()
  const { location: gps } = useGeolocation()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-5 lg:space-y-6"
    >
      {/* Welcome + Stats row */}
      <div className="grid lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 card-moov"
        >
          <h2 className="text-xl font-bold mb-1">
            Bonjour {user?.name || '👋'}
          </h2>
          <p className="text-gray-500 text-sm">Prêt à rouler ?</p>
          {gps && (
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <Navigation size={12} /> Position activée
            </p>
          )}
        </motion.div>

        {[
          { value: user?.rideCount || 0, label: 'Courses', icon: Bike, color: 'text-secondary' },
          { value: user?.deliveryCount || 0, label: 'Livraisons', icon: Package, color: 'text-moov-500' },
          { value: (user?.walletBalance || 0).toLocaleString(), label: 'FCFA', icon: TrendingUp, color: 'text-accent' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="card bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3"
          >
            <div className={`p-2 rounded-xl bg-gray-50 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {SERVICES.map(({ to, icon: Icon, label, desc, color }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
            className="lg:col-span-2"
          >
            <Link
              to={to}
              className="card bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${color} mb-2 shadow-sm group-hover:shadow-md transition-shadow`}>
                <Icon size={24} />
              </div>
              <span className="font-bold text-sm">{label}</span>
              <span className="text-[10px] text-gray-400 mt-0.5">{desc}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Promo + Recent activity row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-gradient-to-br from-secondary to-orange-600 text-white rounded-2xl p-5 shadow-md"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Gift size={28} className="shrink-0" />
            </motion.div>
            <div>
              <h3 className="font-bold text-lg">Premier trajet offert</h3>
              <p className="text-sm opacity-90">Utilisez le code <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-sm font-bold">MOOV1</span></p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-moov"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HistoryIcon size={20} className="text-gray-400" />
              <div>
                <h3 className="font-bold">Activité récente</h3>
                <p className="text-sm text-gray-400 mt-0.5">Aucune pour le moment</p>
              </div>
            </div>
            <Link to="/app/history" className="btn btn-ghost btn-sm text-moov-500 gap-1">
              Voir <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
