import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Plus, Minus, ShoppingCart, ArrowLeft, Navigation, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { deliveries } from '../services/api'
import useGeolocation from '../hooks/useGeolocation'
import AnimatedPage from '../components/AnimatedPage'
import AnimatedCard from '../components/AnimatedCard'
import MapView from '../components/MapView'

export default function Food() {
  const navigate = useNavigate()
  const { location: gps } = useGeolocation()
  const [cantines, setCantines] = useState([])
  const [selected, setSelected] = useState(null)
  const [cart, setCart] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCantines = async () => {
      try {
        const res = await deliveries.getCantines(gps?.lat, gps?.lng)
        setCantines(res.data.data || [])
      } catch {
        setError('Impossible de charger les cantines')
      }
      setLoading(false)
    }
    fetchCantines()
  }, [gps])

  const add = (id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))

  const remove = (id) => {
    setCart(prev => {
      const next = { ...prev }
      if (next[id] > 1) next[id]--
      else delete next[id]
      return next
    })
  }

  const cartTotal = () => {
    if (!selected) return 0
    let total = selected.deliveryFee || 0
    Object.entries(cart).forEach(([itemId, qty]) => {
      const item = selected.menuItems?.find(m => m.id === itemId)
      if (item) total += item.price * qty
    })
    return total
  }

  const handleOrder = async () => {
    if (Object.keys(cart).length === 0) return
    setLoading(true)
    try {
      const res = await deliveries.orderFood({
        cantineId: selected.id,
        items: Object.entries(cart).map(([menuItemId, quantity]) => ({ menuItemId, quantity })),
        dropoffLat: gps?.lat || 6.1319,
        dropoffLng: gps?.lng || 1.2223,
        dropoffAddress: 'Ma position',
      })
      navigate('/app/payment', { state: { type: 'delivery', id: res.data.data.id, amount: res.data.data.price } })
    } catch { alert('Erreur de commande') }
    finally { setLoading(false) }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="card bg-white rounded-2xl shadow-md p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <AnimatedPage className="space-y-4">
      {error && <div className="alert alert-error text-sm">{error}</div>}

      {!selected ? (
        <>
          <motion.div
            className="card-moov"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-bold text-lg">Cantines près de chez vous</h2>
            {gps && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Navigation size={12} /> Basé sur votre position</p>}
          </motion.div>

          {cantines.length === 0 && !loading && (
            <div className="card-moov text-center py-8">
              <Store size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-400">Aucune cantine trouvée</p>
            </div>
          )}

          {cantines.map((c, i) => (
            <AnimatedCard key={c.id} index={i} onClick={() => setSelected(c)} className="card bg-white rounded-2xl shadow-md p-4 w-full text-left hover:shadow-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-moov-100 text-moov-500">
                  <Store size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{c.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{c.address || c.quartier}</p>
                  <div className="flex gap-3 text-xs mt-1">
                    <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" /> {c.rating?.toFixed(1) || '-'}</span>
                    <span className="text-moov-500">Livraison {c.deliveryFee?.toLocaleString()} F</span>
                  </div>
                </div>
                <ArrowLeft size={18} className="text-gray-300 rotate-180 shrink-0" />
              </div>
            </AnimatedCard>
          ))}
        </>
      ) : (
        <>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => { setSelected(null); setCart({}) }}
            className="btn btn-ghost btn-sm gap-2 text-moov-500"
          >
            <ArrowLeft size={16} /> Retour
          </motion.button>

          {selected.lat && selected.lng && (
            <MapView
              center={[selected.lat, selected.lng]}
              pickup={{ lat: gps?.lat || 6.1319, lng: gps?.lng || 1.2223 }}
              dropoff={{ lat: selected.lat, lng: selected.lng, address: selected.name }}
              height="180px"
              className="w-full"
            />
          )}

          <motion.div
            className="card-moov"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-bold text-lg mb-1">{selected.name}</h2>
            <p className="text-sm text-gray-400 mb-4">
              {selected.address || selected.quartier} · Livraison {selected.deliveryFee?.toLocaleString()} F
            </p>

            <div className="divide-y">
              {(selected.menuItems || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{item.category}</span>
                    <p className="text-sm font-semibold text-moov-500">{item.price.toLocaleString()} F</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cart[item.id] ? (
                      <motion.div layout className="flex items-center gap-2">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => remove(item.id)} className="btn btn-xs btn-circle btn-ghost"><Minus size={14} /></motion.button>
                        <span className="font-bold w-6 text-center">{cart[item.id]}</span>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => add(item.id)} className="btn btn-xs btn-circle btn-ghost"><Plus size={14} /></motion.button>
                      </motion.div>
                    ) : (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => add(item.id)} className="btn btn-sm btn-moov">Ajouter</motion.button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {Object.keys(cart).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="card-moov flex items-center justify-between"
              >
                <div>
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-bold text-moov-500 ml-2">{cartTotal().toLocaleString()} F</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOrder}
                  disabled={loading}
                  className="btn btn-moov gap-2"
                >
                  {loading ? <span className="loading loading-spinner loading-sm" /> : <><ShoppingCart size={16} /> Commander</>}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatedPage>
  )
}
