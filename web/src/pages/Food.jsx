import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Plus, Minus, ShoppingCart, ArrowLeft, Loader } from 'lucide-react'
import { deliveries } from '../services/api'

const MOCK_CANTINES = [
  { id: '1', name: 'Cantine Akodessewa', address: 'Akodessewa', rating: 4.5, deliveryFee: 500, menuItems: [
    { id: 'm1', name: 'Pâtes Sauce', price: 1500, cat: 'plat' },
    { id: 'm2', name: 'Riz Gratiné', price: 2000, cat: 'plat' },
    { id: 'm3', name: 'Jus Bissap', price: 500, cat: 'boisson' },
  ]},
  { id: '2', name: 'Chez Ama', address: 'Kodjoviakopé', rating: 4.2, deliveryFee: 500, menuItems: [
    { id: 'm4', name: 'Fufu Sauce Arachide', price: 1200, cat: 'plat' },
    { id: 'm5', name: 'Poisson Braisé', price: 2500, cat: 'plat' },
    { id: 'm6', name: 'Tchoukoutou', price: 700, cat: 'boisson' },
  ]},
  { id: '3', name: 'Resto du Port', address: 'Boulevard du Port', rating: 4.7, deliveryFee: 600, menuItems: [
    { id: 'm7', name: 'Poisson Grillé', price: 3000, cat: 'plat' },
    { id: 'm8', name: 'Riz aux Crevettes', price: 2500, cat: 'plat' },
    { id: 'm9', name: 'Jus d\'Ananas', price: 600, cat: 'boisson' },
  ]},
]

export default function Food() {
  const navigate = useNavigate()
  const [cantines, setCantines] = useState([])
  const [selected, setSelected] = useState(null)
  const [cart, setCart] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => { setCantines(MOCK_CANTINES); setLoading(false) }, 500)
  }, [])

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
    let total = selected.deliveryFee
    Object.entries(cart).forEach(([itemId, qty]) => {
      const item = selected.menuItems.find(m => m.id === itemId)
      if (item) total += item.price * qty
    })
    return total
  }

  const handleOrder = async () => {
    if (Object.keys(cart).length === 0) return
    try {
      const res = await deliveries.orderFood({
        cantineId: selected.id,
        items: Object.entries(cart).map(([menuItemId, quantity]) => ({ menuItemId, quantity })),
        dropoffLat: 6.1319, dropoffLng: 1.2223, dropoffAddress: 'Ma position',
      })
      navigate('/app/payment', { state: { type: 'delivery', id: res.data.data.id, amount: res.data.data.price } })
    } catch { alert('Erreur de commande') }
  }

  if (loading) return <div className="flex justify-center pt-10"><Loader className="animate-spin text-moov-500" size={32} /></div>

  return (
    <div className="space-y-4">
      {!selected ? (
        <>
          <div className="card-moov">
            <h2 className="font-bold text-lg">Cantines près de chez vous</h2>
          </div>
          {cantines.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className="card bg-white rounded-2xl shadow-md p-4 w-full text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-moov-100 text-moov-500"><Store size={24} /></div>
                <div className="flex-1">
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="text-sm text-gray-400">{c.address}</p>
                  <div className="flex gap-3 text-xs mt-1">
                    <span>⭐ {c.rating}</span>
                    <span className="text-moov-500">Livraison {c.deliveryFee} F</span>
                  </div>
                </div>
                <ArrowLeft size={18} className="text-gray-300 rotate-180" />
              </div>
            </button>
          ))}
        </>
      ) : (
        <>
          <button onClick={() => { setSelected(null); setCart({}) }}
            className="btn btn-ghost btn-sm gap-2 text-moov-500"
          >
            <ArrowLeft size={16} /> Retour
          </button>

          <div className="card-moov">
            <h2 className="font-bold text-lg mb-1">{selected.name}</h2>
            <p className="text-sm text-gray-400 mb-4">Frais de livraison: {selected.deliveryFee} F</p>

            <div className="divide-y">
              {selected.menuItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{item.cat}</span>
                    <p className="text-sm font-semibold text-moov-500">{item.price.toLocaleString()} F</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cart[item.id] ? (
                      <>
                        <button onClick={() => remove(item.id)} className="btn btn-xs btn-circle btn-ghost"><Minus size={14} /></button>
                        <span className="font-bold w-6 text-center">{cart[item.id]}</span>
                        <button onClick={() => add(item.id)} className="btn btn-xs btn-circle btn-ghost"><Plus size={14} /></button>
                      </>
                    ) : (
                      <button onClick={() => add(item.id)} className="btn btn-sm btn-moov">Ajouter</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {Object.keys(cart).length > 0 && (
            <div className="card-moov flex items-center justify-between">
              <div>
                <span className="font-bold">Total</span>
                <span className="text-lg font-bold text-moov-500 ml-2">{cartTotal().toLocaleString()} F</span>
              </div>
              <button onClick={handleOrder} className="btn btn-moov gap-2">
                <ShoppingCart size={16} /> Commander
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
