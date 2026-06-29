import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, User, Phone, FileText, Send, Loader } from 'lucide-react'
import { deliveries } from '../services/api'

export default function Parcel() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    pickup: '',
    dropoff: '',
    name: '',
    phone: '',
    note: '',
  })

  const update = (key, value) => setForm(p => ({ ...p, [key]: value }))

  const handleSend = async () => {
    if (!form.pickup || !form.dropoff || !form.name || !form.phone) {
      setError('Champs obligatoires')
      return
    }
    setLoading(true); setError('')
    try {
      const res = await deliveries.sendParcel({
        pickupLat: 6.1319, pickupLng: 1.2223, pickupAddress: form.pickup,
        dropoffLat: 6.1725, dropoffLng: 1.2314, dropoffAddress: form.dropoff,
        recipientName: form.name, recipientPhone: form.phone, note: form.note,
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
    <div className="space-y-4">
      <div className="card-moov">
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
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      <button onClick={handleSend} disabled={loading} className="btn bg-accent hover:bg-accent/90 text-white w-full gap-2 btn-lg rounded-xl border-none">
        {loading ? <Loader className="animate-spin" size={18} /> : <><Send size={18} /> Envoyer le colis</>}
      </button>
    </div>
  )
}
