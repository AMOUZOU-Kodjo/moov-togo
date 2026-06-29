import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Phone, ArrowRight, Loader, CheckCircle, Smartphone } from 'lucide-react'
import { payments } from '../services/api'

const PROVIDERS = [
  { id: 'FLOOZ', label: 'Flooz', color: 'border-red-500 bg-red-50', textColor: 'text-red-600' },
  { id: 'TMONEY', label: 'TMoney', color: 'border-moov-500 bg-moov-50', textColor: 'text-moov-600' },
]

export default function Payment() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [provider, setProvider] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (!state) return navigate('/app', { replace: true })

  const { type, id, amount } = state

  const handlePay = async () => {
    if (!provider) { setError('Choisissez un moyen de paiement'); return }
    setLoading(true); setError('')
    try {
      await payments.pay({
        provider,
        providerPhone: '90000000',
        rideId: type === 'ride' ? id : undefined,
        deliveryId: type === 'delivery' ? id : undefined,
      })
      setDone(true)
    } catch { setError('Paiement échoué. Vérifiez votre solde.') }
    finally { setLoading(false) }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 text-center">
        <CheckCircle size={64} className="text-moov-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Paiement réussi !</h2>
        <p className="text-gray-500 mb-6">Votre commande est confirmée</p>
        <button onClick={() => navigate('/app')} className="btn btn-moov">
          Retour à l'accueil
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card-moov text-center">
        <p className="text-gray-400 text-sm">Montant à payer</p>
        <p className="text-4xl font-extrabold text-gray-800 my-2">{amount?.toLocaleString()} FCFA</p>
        <p className="text-sm text-moov-500">{type === 'ride' ? 'Course Moov\' Togo' : 'Livraison Moov\' Togo'}</p>
      </div>

      <div className="card-moov">
        <h3 className="font-bold mb-4">Moyen de paiement</h3>
        <div className="space-y-3">
          {PROVIDERS.map(p => (
            <button key={p.id} onClick={() => setProvider(p.id)}
              className={`w-full border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${
                provider === p.id ? `${p.color} border-2` : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Smartphone size={24} className={provider === p.id ? p.textColor : 'text-gray-400'} />
              <span className={`font-bold flex-1 text-left ${provider === p.id ? p.textColor : ''}`}>{p.label}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                provider === p.id ? `${p.textColor.replace('text', 'border')}` : 'border-gray-300'
              }`}>
                {provider === p.id && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      <button onClick={handlePay} disabled={!provider || loading} className={`btn w-full gap-2 btn-lg rounded-xl ${
        provider ? 'btn-moov' : 'btn-disabled'
      }`}>
        {loading ? <Loader className="animate-spin" size={18} /> : <><ArrowRight size={18} /> Payer {amount?.toLocaleString()} FCFA</>}
      </button>
    </div>
  )
}
