import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Smartphone, Wallet } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { payments } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AnimatedPage from '../components/AnimatedPage'

const PROVIDERS = [
  { id: 'FLOOZ', label: 'Flooz', color: 'border-red-500 bg-red-50', textColor: 'text-red-600', icon: Smartphone },
  { id: 'TMONEY', label: 'TMoney', color: 'border-moov-500 bg-moov-50', textColor: 'text-moov-600', icon: Smartphone },
  { id: 'WALLET', label: 'Portefeuille Moov\'', color: 'border-accent bg-blue-50', textColor: 'text-accent', icon: Wallet },
]

export default function Payment() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [provider, setProvider] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (!state) {
    navigate('/app', { replace: true })
    return null
  }

  const { type, id, amount } = state

  const handlePay = async () => {
    if (!provider) { setError('Choisissez un moyen de paiement'); return }
    setLoading(true); setError('')
    try {
      await payments.pay({
        provider,
        providerPhone: user?.phone?.replace('+228', '') || '90000000',
        rideId: type === 'ride' ? id : undefined,
        deliveryId: type === 'delivery' ? id : undefined,
      })
      setDone(true)
      setTimeout(() => navigate('/app'), 3000)
    } catch { setError('Paiement échoué. Vérifiez votre solde.') }
    finally { setLoading(false) }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center pt-20 text-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        >
          <CheckCircle size={80} className="text-moov-500 mb-4" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold mb-2"
        >
          Paiement réussi !
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-6"
        >
          Votre commande est confirmée
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/app')}
          className="btn btn-moov"
        >
          Retour à l'accueil
        </motion.button>
      </motion.div>
    )
  }

  return (
    <AnimatedPage>
      <motion.div
        className="card-moov text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-gray-400 text-sm">Montant à payer</p>
        <motion.p
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-4xl font-extrabold text-gray-800 my-2"
        >
          {amount?.toLocaleString()} FCFA
        </motion.p>
        <p className="text-sm text-moov-500">
          {type === 'ride' ? 'Course Moov\' Togo' : 'Livraison Moov\' Togo'}
        </p>
      </motion.div>

      <motion.div
        className="card-moov"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-bold mb-4">Moyen de paiement</h3>
        <div className="space-y-3">
          {PROVIDERS.map(p => {
            const Icon = p.icon
            return (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setProvider(p.id)}
                className={`w-full border-2 rounded-xl p-4 flex items-center gap-3 ${
                  provider === p.id ? `${p.color} border-2` : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon size={24} className={provider === p.id ? p.textColor : 'text-gray-400'} />
                <div className="flex-1 text-left">
                  <span className={`font-bold block ${provider === p.id ? p.textColor : ''}`}>{p.label}</span>
                  {p.id === 'WALLET' && (
                    <span className="text-xs text-gray-400">
                      Solde: {(user?.walletBalance || 0).toLocaleString()} FCFA
                    </span>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  provider === p.id ? `${p.textColor.replace('text', 'border')}` : 'border-gray-300'
                }`}>
                  {provider === p.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 rounded-full bg-current" />}
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="alert alert-error text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={provider ? { scale: 1.02 } : {}}
        whileTap={provider ? { scale: 0.98 } : {}}
        onClick={handlePay}
        disabled={!provider || loading}
        className={`btn w-full gap-2 btn-lg rounded-xl ${
          provider ? 'btn-moov' : 'btn-disabled'
        }`}
      >
        {loading ? <span className="loading loading-spinner" /> : <><ArrowRight size={18} /> Payer {amount?.toLocaleString()} FCFA</>}
      </motion.button>

      <p className="text-xs text-gray-400 text-center">
        Paiement sécurisé via {provider === 'FLOOZ' ? 'Flooz' : provider === 'TMONEY' ? 'TMoney' : 'Mobile Money'}
      </p>
    </AnimatedPage>
  )
}
