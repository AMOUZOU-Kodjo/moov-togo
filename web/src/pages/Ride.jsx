import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, Car, MapPin, Crosshair, ArrowRight, Loader } from 'lucide-react'
import { rides } from '../services/api'

const VEHICLES = [
  { id: 'zemidjan', icon: Bike, label: 'Zémidjan', price: '200 F/km' },
  { id: 'voiture', icon: Car, label: 'Taxi', price: '350 F/km' },
]

export default function Ride() {
  const navigate = useNavigate()
  const [pickup, setPickup] = useState('Akodessewa, Lomé')
  const [dropoff, setDropoff] = useState('')
  const [vehicle, setVehicle] = useState('zemidjan')
  const [estimate, setEstimate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEstimate = async () => {
    if (!pickup || !dropoff) { setError('Veuillez entrer les adresses'); return }
    setLoading(true); setError(''); setEstimate(null)
    try {
      const res = await rides.estimate({
        pickupLat: 6.1319, pickupLng: 1.2223,
        dropoffLat: 6.1725, dropoffLng: 1.2314,
        vehicleType: vehicle,
      })
      setEstimate(res.data.data)
    } catch { setError('Erreur de calcul') }
    finally { setLoading(false) }
  }

  const handleBook = async () => {
    setLoading(true)
    try {
      const res = await rides.create({
        pickupLat: 6.1319, pickupLng: 1.2223, pickupAddress: pickup,
        dropoffLat: 6.1725, dropoffLng: 1.2314, dropoffAddress: dropoff,
        vehicleType: vehicle,
      })
      navigate('/app/payment', { state: { type: 'ride', id: res.data.data.id, amount: res.data.data.price } })
    } catch { setError('Erreur de réservation') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card-moov">
        <h2 className="font-bold text-lg mb-4">Où allez-vous ?</h2>

        <div className="space-y-3">
          <label className="input input-bordered flex items-center gap-2 rounded-xl border-gray-200">
            <MapPin size={18} className="text-moov-500" />
            <input type="text" className="grow" placeholder="Adresse de départ" value={pickup} onChange={e => setPickup(e.target.value)} />
          </label>
          <label className="input input-bordered flex items-center gap-2 rounded-xl border-gray-200">
            <MapPin size={18} className="text-secondary" />
            <input type="text" className="grow" placeholder="Adresse d'arrivée" value={dropoff} onChange={e => setDropoff(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="card-moov">
        <h3 className="font-semibold mb-3">Type de véhicule</h3>
        <div className="grid grid-cols-2 gap-3">
          {VEHICLES.map(({ id, icon: Icon, label, price }) => (
            <button key={id} onClick={() => setVehicle(id)}
              className={`btn border-2 rounded-xl h-auto py-4 flex-col gap-1 ${
                vehicle === id ? 'border-secondary bg-secondary/5 text-secondary' : 'border-gray-200'
              }`}
            >
              <Icon size={28} />
              <span className="font-bold text-sm">{label}</span>
              <span className="text-xs opacity-70">{price}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {!estimate ? (
        <button onClick={handleEstimate} disabled={loading} className="btn btn-moov w-full gap-2 btn-lg">
          {loading ? <Loader className="animate-spin" size={18} /> : <><Crosshair size={18} /> Estimer le prix</>}
        </button>
      ) : (
        <div className="card-moov">
          <h3 className="font-bold mb-3">Estimation</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Distance</span><span className="font-semibold">{estimate.distanceKm} km</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Durée</span><span className="font-semibold">~{estimate.durationMin} min</span></div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold">Prix</span>
              <span className="font-bold text-xl text-secondary">{estimate.price.toLocaleString()} FCFA</span>
            </div>
          </div>
          <button onClick={handleBook} disabled={loading} className="btn btn-moov w-full mt-4 gap-2">
            {loading ? <Loader className="animate-spin" size={18} /> : <><ArrowRight size={18} /> Réserver maintenant</>}
          </button>
        </div>
      )}
    </div>
  )
}
