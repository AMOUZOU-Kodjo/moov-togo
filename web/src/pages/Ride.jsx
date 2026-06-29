import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, Car, MapPin, Crosshair, ArrowRight, LocateFixed, Navigation } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { rides } from '../services/api'
import useGeolocation from '../hooks/useGeolocation'
import MapView from '../components/MapView'
import AnimatedPage from '../components/AnimatedPage'

const VEHICLES = [
  { id: 'zemidjan', icon: Bike, label: 'Zémidjan', price: '200 F/km' },
  { id: 'voiture', icon: Car, label: 'Taxi', price: '350 F/km' },
]

export default function Ride() {
  const navigate = useNavigate()
  const { location: gps, loading: gpsLoading, error: gpsError, refresh } = useGeolocation()
  const [pickup, setPickup] = useState('')
  const [pickupCoords, setPickupCoords] = useState(null)
  const [dropoff, setDropoff] = useState('')
  const [dropoffCoords, setDropoffCoords] = useState(null)
  const [vehicle, setVehicle] = useState('zemidjan')
  const [estimate, setEstimate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (gps && !pickupCoords) {
      setPickupCoords(gps)
    }
  }, [gps])

  const geocodeAddress = async (query) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}+Lom%C3%A9+Togo&limit=1`
      )
      const data = await res.json()
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      }
    } catch {}
    return null
  }

  const handlePickupChange = async (val) => {
    setPickup(val)
    setEstimate(null)
    if (val.length > 3) {
      const coords = await geocodeAddress(val)
      if (coords) setPickupCoords(coords)
    }
  }

  const handleDropoffChange = async (val) => {
    setDropoff(val)
    setEstimate(null)
    if (val.length > 3) {
      const coords = await geocodeAddress(val)
      if (coords) setDropoffCoords(coords)
    }
  }

  const handleMapClick = (latlng, type) => {
    if (type === 'pickup') {
      setPickupCoords(latlng)
      setPickup(`${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`)
    } else {
      setDropoffCoords(latlng)
      setDropoff(`${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`)
    }
    setEstimate(null)
  }

  const useCurrentLocation = () => {
    refresh()
    if (gps) {
      setPickupCoords(gps)
      setPickup(`${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}`)
    }
  }

  const handleEstimate = async () => {
    if (!pickupCoords || !dropoffCoords) {
      setError('Veuillez définir les adresses sur la carte')
      return
    }
    setLoading(true); setError(''); setEstimate(null)
    try {
      const res = await rides.estimate({
        pickupLat: pickupCoords.lat, pickupLng: pickupCoords.lng,
        dropoffLat: dropoffCoords.lat, dropoffLng: dropoffCoords.lng,
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
        pickupLat: pickupCoords.lat, pickupLng: pickupCoords.lng,
        pickupAddress: pickup,
        dropoffLat: dropoffCoords.lat, dropoffLng: dropoffCoords.lng,
        dropoffAddress: dropoff,
        vehicleType: vehicle,
      })
      navigate('/app/payment', { state: { type: 'ride', id: res.data.data.id, amount: res.data.data.price } })
    } catch { setError('Erreur de réservation') }
    finally { setLoading(false) }
  }

  return (
    <AnimatedPage className="space-y-4 lg:space-y-6">
      <div className="lg:grid lg:grid-cols-5 lg:gap-6">
        <div className="lg:col-span-3 space-y-4">
          <motion.div className="card-moov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-bold text-lg mb-3">Où allez-vous ?</h2>
            <div className="space-y-2 mb-3">
              <div className="flex gap-2">
                <label className="input input-bordered flex items-center gap-2 rounded-xl border-gray-200 flex-1">
                  <MapPin size={18} className="text-moov-500 shrink-0" />
                  <input type="text" className="grow" placeholder="Départ" value={pickup} onChange={e => handlePickupChange(e.target.value)} />
                </label>
                <button onClick={useCurrentLocation} className="btn btn-ghost btn-square text-moov-500" title="Ma position">
                  <LocateFixed size={20} />
                </button>
              </div>
              <label className="input input-bordered flex items-center gap-2 rounded-xl border-gray-200">
                <MapPin size={18} className="text-secondary shrink-0" />
                <input type="text" className="grow" placeholder="Arrivée" value={dropoff} onChange={e => handleDropoffChange(e.target.value)} />
              </label>
            </div>
            {gpsLoading && <p className="text-xs text-gray-400 animate-pulse">Localisation en cours...</p>}
            {gpsError && <p className="text-xs text-red-400">GPS: {gpsError}</p>}
            <div className="lg:hidden">
              <MapView
                pickup={pickupCoords}
                dropoff={dropoffCoords}
                center={pickupCoords || gps}
                onClick={(latlng) => {
                  if (!pickupCoords) handleMapClick(latlng, 'pickup')
                  else if (!dropoffCoords) handleMapClick(latlng, 'dropoff')
                  else handleMapClick(latlng, 'dropoff')
                }}
                className="w-full"
                height="220px"
              />
            </div>
            <div className="flex gap-2 mt-2 text-xs text-gray-400 lg:hidden">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-moov-500" /> Départ</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-secondary" /> Arrivée</span>
              <span className="text-gray-300">| Cliquez sur la carte</span>
            </div>
          </motion.div>

          <motion.div className="card-moov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="font-semibold mb-3">Type de véhicule</h3>
            <div className="grid grid-cols-2 gap-3">
              {VEHICLES.map(({ id, icon: Icon, label, price }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setVehicle(id)}
                  className={`btn border-2 rounded-xl h-auto py-4 flex-col gap-1 ${
                    vehicle === id ? 'border-secondary bg-secondary/5 text-secondary shadow-sm' : 'border-gray-200'
                  }`}
                >
                  <Icon size={28} />
                  <span className="font-bold text-sm">{label}</span>
                  <span className="text-xs opacity-70">{price}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="hidden lg:block">
            <motion.div className="card-moov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h3 className="font-semibold mb-2 text-sm">Carte</h3>
              <MapView
                pickup={pickupCoords}
                dropoff={dropoffCoords}
                center={pickupCoords || gps}
                onClick={(latlng) => {
                  if (!pickupCoords) handleMapClick(latlng, 'pickup')
                  else if (!dropoffCoords) handleMapClick(latlng, 'dropoff')
                  else handleMapClick(latlng, 'dropoff')
                }}
                className="w-full"
                height="300px"
              />
              <div className="flex gap-3 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-moov-500" /> Départ</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-secondary" /> Arrivée</span>
              </div>
            </motion.div>
          </div>

          {estimate && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="card-moov"
              >
                <h3 className="font-bold mb-3">Estimation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1"><Navigation size={14} /> Distance</span>
                    <span className="font-semibold">{estimate.distanceKm.toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Durée</span>
                    <span className="font-semibold">~{estimate.durationMin} min</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-bold">Prix total</span>
                    <span className="font-bold text-2xl text-secondary">{estimate.price.toLocaleString()} FCFA</span>
                  </div>
                </div>
                {estimate.breakdown && (
                  <div className="mt-2 text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between"><span>Base</span><span>{estimate.breakdown.base} F</span></div>
                    <div className="flex justify-between"><span>Distance ({estimate.distanceKm.toFixed(1)} km)</span><span>{estimate.breakdown.distance} F</span></div>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBook}
                  disabled={loading}
                  className="btn btn-moov w-full mt-4 gap-2"
                >
                  {loading ? <span className="loading loading-spinner" /> : <><ArrowRight size={18} /> Réserver maintenant</>}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {error && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="alert alert-error text-sm">{error}</motion.div>}

      {!estimate && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEstimate}
          disabled={loading || !pickupCoords || !dropoffCoords}
          className="btn btn-moov w-full gap-2 btn-lg lg:w-auto lg:px-8"
        >
          {loading ? <span className="loading loading-spinner" /> : <><Crosshair size={18} /> Estimer le prix</>}
        </motion.button>
      )}
    </AnimatedPage>
  )
}
