import { useState } from 'react'
import { Bike, Navigation, Power, Clock, DollarSign } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Drivers() {
  const { user } = useAuth()
  const [online, setOnline] = useState(false)

  const MOCK_REQUESTS = [
    { id: 'r1', from: 'Akodessewa', to: 'Kodjoviakopé', price: 2500, dist: '3.2 km' },
    { id: 'r2', from: 'Boulevard du Port', to: 'Lomé 2', price: 1800, dist: '2.1 km' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="bg-moov-500 text-white px-4 pt-6 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Moov' Chauffeur</h1>
            <p className="text-xs opacity-80">{user?.name}</p>
          </div>
          <button onClick={() => setOnline(!online)}
            className={`btn btn-sm gap-2 rounded-xl ${online ? 'bg-success text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            <Power size={14} /> {online ? 'En ligne' : 'Hors ligne'}
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {online && (
          <>
            <div className="card-moov flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Navigation size={24} className="text-moov-500" />
                <div>
                  <p className="font-bold">En attente de courses</p>
                  <p className="text-sm text-gray-400">Chauffeurs à proximité: 12</p>
                </div>
              </div>
              <span className="loading loading-ring loading-md text-moov-500" />
            </div>

            <h3 className="font-bold text-sm text-gray-500 px-1">Demandes à proximité</h3>
            {MOCK_REQUESTS.map(r => (
              <div key={r.id} className="card bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Bike size={16} className="text-secondary" />
                  <span className="font-medium">{r.from}</span>
                  <span className="text-gray-300">→</span>
                  <span className="font-medium">{r.to}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={12} /> {r.dist}</span>
                    <span className="flex items-center gap-1"><DollarSign size={12} /> {r.price} F</span>
                  </div>
                  <button className="btn btn-sm btn-moov rounded-xl">Accepter</button>
                </div>
              </div>
            ))}
          </>
        )}

        {!online && (
          <div className="card-moov text-center py-10">
            <Bike size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">Passez en ligne pour recevoir des demandes</p>
          </div>
        )}
      </main>
    </div>
  )
}
