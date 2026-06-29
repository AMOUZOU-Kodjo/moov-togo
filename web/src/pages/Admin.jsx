import { useState } from 'react'
import { Users, Bike, Package, TrendingUp, DollarSign, Navigation } from 'lucide-react'

const MONTHLY_DATA = [
  { m: 'Jan', courses: 120, livraisons: 85, revenus: 450 },
  { m: 'Fév', courses: 150, livraisons: 95, revenus: 520 },
  { m: 'Mar', courses: 180, livraisons: 110, revenus: 610 },
  { m: 'Avr', courses: 220, livraisons: 140, revenus: 780 },
  { m: 'Mai', courses: 250, livraisons: 160, revenus: 850 },
  { m: 'Juin', courses: 300, livraisons: 200, revenus: 1020 },
]

const RECENT = [
  { user: 'Koffi A.', action: 'Course acceptée', status: 'En cours', amount: '2 500 F' },
  { user: 'Ama D.', action: 'Commande repas', status: 'Livré', amount: '3 200 F' },
  { user: 'Yao M.', action: 'Envoi colis Lomé→Kara', status: 'En transit', amount: '5 000 F' },
  { user: 'Essi K.', action: 'Course terminée', status: 'Terminé', amount: '1 800 F' },
]

export default function Admin() {
  const [nav, setNav] = useState('dashboard')

  const SIDEBAR = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'rides', label: 'Courses', icon: Bike },
    { id: 'deliveries', label: 'Livraisons', icon: Package },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'payments', label: 'Paiements', icon: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-moov-500 text-white p-4 hidden md:block">
        <h1 className="text-xl font-bold mb-1">Moov' Togo</h1>
        <p className="text-xs opacity-70 mb-8">Dashboard Admin</p>
        <div className="space-y-1">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Courses du jour', value: '47', color: 'text-secondary', icon: Bike },
            { label: 'Livraisons du jour', value: '32', color: 'text-moov-500', icon: Package },
            { label: 'Revenus du jour', value: '142 500 F', color: 'text-accent', icon: DollarSign },
            { label: 'Chauffeurs en ligne', value: '23', color: 'text-purple-500', icon: Navigation },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="card bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{s.label}</span>
                  <Icon size={18} className={s.color} />
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold mb-4">Évolution mensuelle</h3>
            <div className="space-y-3">
              {MONTHLY_DATA.map(d => (
                <div key={d.m} className="flex items-center gap-3 text-sm">
                  <span className="w-8 font-medium text-gray-500">{d.m}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-12">Courses</span>
                      <div className="flex-1 h-2 bg-orange-100 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: `${(d.courses / 300) * 100}%` }} />
                      </div>
                      <span className="text-xs font-semibold">{d.courses}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-12">Livraisons</span>
                      <div className="flex-1 h-2 bg-green-100 rounded-full overflow-hidden">
                        <div className="h-full bg-moov-500 rounded-full" style={{ width: `${(d.livraisons / 200) * 100}%` }} />
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
              {[
                { label: 'Courses', value: 55, color: 'bg-secondary' },
                { label: 'Repas', value: 25, color: 'bg-moov-500' },
                { label: 'Colis', value: 20, color: 'bg-accent' },
              ].map(s => (
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
                {RECENT.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="font-semibold">{r.user}</td>
                    <td className="text-sm">{r.action}</td>
                    <td>
                      <span className={`badge badge-sm ${
                        r.status === 'Terminé' || r.status === 'Livré' ? 'badge-success' :
                        r.status === 'En cours' || r.status === 'En transit' ? 'badge-info' : 'badge-warning'
                      }`}>{r.status}</span>
                    </td>
                    <td className="font-semibold text-moov-500">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
