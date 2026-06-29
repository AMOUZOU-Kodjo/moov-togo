import { useState, useEffect } from 'react'
import { Bike, Package, Clock, Loader } from 'lucide-react'
import { rides, deliveries } from '../services/api'

const STATUS_LABELS = {
  PENDING: { label: 'En attente', class: 'badge-warning' },
  ACCEPTED: { label: 'Accepté', class: 'badge-info' },
  IN_PROGRESS: { label: 'En cours', class: 'badge-info' },
  COMPLETED: { label: 'Terminé', class: 'badge-success' },
  DELIVERED: { label: 'Livré', class: 'badge-success' },
  CANCELLED: { label: 'Annulé', class: 'badge-error' },
}

export default function History() {
  const [tab, setTab] = useState('rides')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fn = tab === 'rides' ? rides.list : deliveries.list
    fn().then(r => setData(r.data.data || [])).catch(() => setData([])).finally(() => setLoading(false))
  }, [tab])

  return (
    <div className="space-y-4">
      <div className="card-moov">
        <h2 className="font-bold text-lg mb-1">Historique</h2>
      </div>

      <div role="tablist" className="tabs tabs-boxed bg-white rounded-xl">
        <button role="tab" className={`tab flex-1 ${tab === 'rides' ? 'tab-active bg-moov-500 text-white' : ''}`} onClick={() => setTab('rides')}>
          Courses
        </button>
        <button role="tab" className={`tab flex-1 ${tab === 'deliveries' ? 'tab-active bg-moov-500 text-white' : ''}`} onClick={() => setTab('deliveries')}>
          Livraisons
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10"><Loader className="animate-spin text-moov-500" size={32} /></div>
      ) : data.length === 0 ? (
        <div className="card-moov text-center py-10">
          <Clock size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">Aucun historique</p>
        </div>
      ) : (
        data.map(item => {
          const s = STATUS_LABELS[item.status] || { label: item.status, class: 'badge-ghost' }
          const Icon = tab === 'rides' ? Bike : Package
          return (
            <div key={item.id} className="card bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} className="text-moov-500" />
                <span className={`badge ${s.class} text-xs`}>{s.label}</span>
              </div>
              <div className="text-sm space-y-0.5">
                <p className="font-medium">{item.pickupAddress}</p>
                <p className="text-gray-400 text-xs">↓</p>
                <p className="font-medium">{item.dropoffAddress}</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="font-bold text-moov-500">{item.price?.toLocaleString()} FCFA</span>
                <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
