import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, User, Phone, FileText, Send, LocateFixed } from 'lucide-react'
import { motion } from 'framer-motion'
import { deliveries } from '../services/api'
import useGeolocation from '../hooks/useGeolocation'
import AnimatedPage from '../components/AnimatedPage'
import MapView from '../components/MapView'

export default function Parcel() {
  const navigate = useNavigate()
  const { location: gps, loading: gpsLoading, refresh } = useGeolocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pickupCoords, setPickupCoords] = useState(null)
  const [dropoffCoords, setDropoffCoords] = useState(null)
  const [form, setForm] = useState({
    pickup: '',
    dropoff: '',
    name: '',
    phone: '',
    note: '',
  })

  useEffect(() => {
    if (gps && !pickupCoords) {
      setPickupCoords(gps)
    }
  }, [gps])

  const update = (key, value) => setForm(p => ({ ...p, [key]: value }))

  const useCurrentLocation = () => {
    refresh()
    if (gps) {
      setPickupCoords(gps)
      setForm(p => ({ ...p, pickup: `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` }))
    }
  }

  const handleMapClick = (latlng, type) => {
    if (type === 'pickup') {
      setPickupCoords(latlng)
      setForm(p => ({ ...p, pickup: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}` }))
    } else {
      setDropoffCoords(latlng)
      setForm(p => ({ ...p, dropoff: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}` }))
    }
  }

  const handleSend = async () => {
    if (!form.pickup || !form.dropoff || !form.name || !form.phone) {
      setError('Champs obligatoires')
      return
    }
    if (!pickupCoords || !dropoffCoords) {
      setError('Positionnez les points sur la carte')
      return
    }
    setLoading(true); setError('')
    try {
      const res = await deliveries.sendParcel({
        pickupLat: pickupCoords.lat, pickupLng: pickupCoords.lng,
        pickupAddress: form.pickup,
        dropoffLat: dropoffCoords.lat, dropoffLng: dropoffCoords.lng,
        dropoffAddress: form.dropoff,
        recipientName: form.name,
        recipientPhone: '+228' + form.phone.replace(/\D/g, ''),
        note: form.note,
      })
      navigate('/app/payment', { state: { type: 'delivery', id: res.data.data.id, amount: res.data.data.price } })
    } catch { setError('Erreur d\'envoi') }
    finally { setLoading(false) }
  }

  const inputs = [
    { key: 'pickup', icon: MapPin, placeholder: 'Adresse de ramassage', color: 'text-moov-500' },
    { key: 'dropoff', icon: MapPin, placeholder: 'Adresse de livraison', color: 'text-secondary' },
    { key: 'name', icon: User, placeholder: 'Nom du destinataire', color: 'text-accent' },
    { key: 'phone', icon: Phone, placeholder: 'Téléphone du destinataire', color: 'text-accent', prefix: '+228', maxLength: 8, type: 'tel' },
  ]

  return (
    <AnimatedPage className="space-y-4">
      <motion.div
        className="card-moov"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-bold text-lg mb-4">Envoyer un colis</h2>
        <div className="space-y-3">
          {inputs.map(({ key, icon: Icon, placeholder, color, prefix, maxLength, type }) => (
            <label key={key} className="input input-bordered flex items-center gap-2 rounded-xl border-gray-200">
              <Icon size={18} className={color} />
              {prefix && <span className="text-gray-400 text-sm">{prefix}</span>}
              <input
                type={type || 'text'} className="grow"
                placeholder={placeholder}
                maxLength={maxLength}
                value={form[key]}
                onChange={e => update(key, e.target.value)}
              />
            </label>
          ))}
          <label className="input input-bordered flex items-center gap-2 rounded-xl border-gray-200">
            <FileText size={18} className="text-gray-400" />
            <input type="text" className="grow" placeholder="Note (optionnelle)" value={form.note} onChange={e => update('note', e.target.value)} />
          </label>
        </div>
      </motion.div>

      <motion.div
        className="card-moov"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">Position sur la carte</span>
          <button onClick={useCurrentLocation} className="btn btn-ghost btn-xs text-moov-500 gap-1">
            <LocateFixed size={14} /> Ma position
          </button>
        </div>
        {gpsLoading && <p className="text-xs text-gray-400 animate-pulse mb-2">Localisation... Autorisez l'accès GPS</p>}
        <MapView
          pickup={pickupCoords}
          dropoff={dropoffCoords}
          center={pickupCoords || gps}
          onClick={(latlng) => {
            if (!pickupCoords) handleMapClick(latlng, 'pickup')
            else handleMapClick(latlng, 'dropoff')
          }}
          height="200px"
          className="w-full"
        />
        <div className="flex gap-3 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-moov-500" /> Ramassage</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-secondary" /> Livraison</span>
        </div>
      </motion.div>

      {error && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="alert alert-error text-sm">{error}</motion.div>}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSend}
        disabled={loading}
        className="btn bg-accent hover:bg-accent/90 text-white w-full gap-2 btn-lg rounded-xl border-none"
      >
        {loading ? <span className="loading loading-spinner" /> : <><Send size={18} /> Envoyer le colis</>}
      </motion.button>
    </AnimatedPage>
  )
}
