import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Bike, Package, TrendingUp, DollarSign, Navigation, ArrowLeft, Loader2 } from 'lucide-react'
import { admin as adminApi } from '../services/api'
import AnimatedPage from '../components/AnimatedPage'

export default function Admin() {
  const navigate = useNavigate()
  const [nav, setNav] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({ stats: {}, monthly: [], breakdown: [], recent: [] })

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.dashboard()
        setData(res.data.data)
      } catch (err) {
        setError('Impossible de charger les données')
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const SIDEBAR = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'rides', label: 'Courses', icon: Bike },
    { id: 'deliveries', label: 'Livraisons', icon: Package },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'payments', label: 'Paiements', icon: DollarSign },
  ]

  const { stats, monthly, breakdown, recent } = data

  const statCards = [
    { label: 'Courses du jour', value: stats.todayRides?.toString() || '0', color: 'text-secondary', icon: Bike },
    { label: 'Livraisons du jour', value: stats.todayDeliveries?.toString() || '0', color: 'text-moov-500', icon: Package },
    { label: 'Revenus du jour', value: `${(stats.todayRevenue || 0).toLocaleString()} F`, color: 'text-accent', icon: DollarSign },
    { label: 'Chauffeurs en ligne', value: stats.onlineDrivers?.toString() || '0', color: 'text-purple-500', icon: Navigation },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-moov-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-moov-500 text-white p-4 hidden md:flex flex-col">
        <button onClick={() => navigate('/app')} className="flex items-center gap-2 text-white/80 hover:text-white mb-1 text-sm">
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="text-xl font-bold mb-1">Moov' Togo</h1>
        <p className="text-xs opacity-70 mb-6">Dashboard Admin</p>
        <div className="space-y-1 flex-1">
          {SIDEBAR.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setNav(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                nav === id ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {statCards.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="card bg-white rounded-2xl shadow-sm p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{s.label}</span>
                  <Icon size={18} className={s.color} />
                </div>
                <p className={`text-xl md:text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            )
          })}
        </div>

        {nav === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              <div className="card bg-white rounded-2xl shadow-sm p-4">
                <p className="text-xs text-gray-400">Utilisateurs</p>
                <p className="text-xl font-bold">{stats.totalUsers || 0}</p>
              </div>
              <div className="card bg-white rounded-2xl shadow-sm p-4">
                <p className="text-xs text-gray-400">Chauffeurs</p>
                <p className="text-xl font-bold">{stats.totalDrivers || 0}</p>
              </div>
              <div className="card bg-white rounded-2xl shadow-sm p-4">
                <p className="text-xs text-gray-400">Cantines</p>
                <p className="text-xl font-bold">{stats.totalCantines || 0}</p>
              </div>
              <div className="card bg-white rounded-2xl shadow-sm p-4">
                <p className="text-xs text-gray-400">Revenus totaux</p>
                <p className="text-xl font-bold">{(stats.totalRevenue || 0).toLocaleString()} F</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="card bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-bold mb-4">Évolution mensuelle</h3>
                <div className="space-y-3">
                  {(monthly || []).length === 0 && <p className="text-sm text-gray-400">Aucune donnée</p>}
                  {(monthly || []).map(d => (
                    <div key={d.m} className="flex items-center gap-3 text-sm">
                      <span className="w-8 font-medium text-gray-500">{d.m}</span>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-12">Courses</span>
                          <div className="flex-1 h-2 bg-orange-100 rounded-full overflow-hidden">
                            <div className="h-full bg-secondary rounded-full" style={{ width: `${Math.min((d.courses / 30) * 100, 100)}%` }} />
                          </div>
                          <span className="text-xs font-semibold">{d.courses}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-12">Livraisons</span>
                          <div className="flex-1 h-2 bg-green-100 rounded-full overflow-hidden">
                            <div className="h-full bg-moov-500 rounded-full" style={{ width: `${Math.min((d.livraisons / 20) * 100, 100)}%` }} />
                          </div>
                          <span className="text-xs font-semibold">{d.livraisons}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-bold mb-4">Répartition des services</h3>
                <div className="space-y-4">
                  {(breakdown || []).length === 0 && <p className="text-sm text-gray-400">Aucune donnée</p>}
                  {(breakdown || []).map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{s.label}</span>
                        <span className="font-semibold">{s.value}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold mb-4">Activité récente</h3>
              <div className="overflow-x-auto">
                {(recent || []).length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Aucune activité récente</p>
                ) : (
                  <table className="table table-sm">
                    <thead>
                      <tr className="text-xs text-gray-400">
                        <th>Client</th>
                        <th>Action</th>
                        <th>Statut</th>
                        <th>Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(recent || []).map((r, i) => (
                        <tr key={i} className="border-t border-gray-100">
                          <td className="font-semibold">{r.user}</td>
                          <td className="text-sm">{r.action}</td>
                          <td>
                            <span className={`badge badge-sm ${
                              r.status === 'Terminé' || r.status === 'Livré' ? 'badge-success' :
                              r.status === 'En cours' || r.status === 'En transit' || r.status === 'Accepté' ? 'badge-info' : 'badge-warning'
                            }`}>{r.status}</span>
                          </td>
                          <td className="font-semibold text-moov-500">{r.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {nav === 'rides' && (
          <div className="card bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold mb-4">Toutes les courses</h3>
            <p className="text-sm text-gray-400">Total : {stats.totalRides || 0} courses</p>
          </div>
        )}

        {nav === 'deliveries' && (
          <div className="card bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold mb-4">Toutes les livraisons</h3>
            <p className="text-sm text-gray-400">Total : {stats.totalDeliveries || 0} livraisons</p>
          </div>
        )}

        {nav === 'users' && (
          <div className="card bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold mb-4">Utilisateurs</h3>
            <p className="text-sm text-gray-400">Total : {stats.totalUsers || 0} utilisateurs</p>
          </div>
        )}

        {nav === 'payments' && (
          <div className="card bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold mb-4">Paiements</h3>
            <p className="text-sm text-gray-400">Revenus totaux : {(stats.totalRevenue || 0).toLocaleString()} F</p>
          </div>
        )}
      </main>
    </div>
  )
}
