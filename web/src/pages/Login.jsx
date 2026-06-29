import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Lock, ArrowRight, Smartphone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { sendOtp, login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (phone.length < 8) { setError('Numéro invalide'); return }
    setLoading(true); setError('')
    try {
      await sendOtp('+228' + phone)
      setStep('otp')
    } catch { setError('Erreur d\'envoi') }
    finally { setLoading(false) }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (code.length < 4) { setError('Code invalide'); return }
    setLoading(true); setError('')
    try {
      await login(phone, code)
      navigate('/app')
    } catch { setError('Code incorrect') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-moov-500 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-white">Moov'</h1>
            <p className="text-white/70">Togo</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp}>
                <h2 className="text-lg font-bold mb-1">Connexion</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Entrez votre numéro pour recevoir un code
                </p>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Numéro de téléphone</span>
                  </label>
                  <div className="join w-full">
                    <span className="join-item btn btn-disabled bg-gray-100 border-gray-200 text-gray-600 px-3">
                      +228
                    </span>
                    <input
                      type="tel"
                      placeholder="90 00 00 00"
                      maxLength={8}
                      className="input input-bordered join-item flex-1 rounded-r-xl border-gray-200 focus:border-moov-500"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                </div>

                {error && <div className="alert alert-error text-sm p-2 mb-4">{error}</div>}

                <button
                  type="submit"
                  className="btn btn-moov w-full gap-2"
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner" /> : <><Smartphone size={18} /> Envoyer le code</>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify}>
                <h2 className="text-lg font-bold mb-1">Code de vérification</h2>
                <p className="text-sm text-gray-500 mb-2">
                  Code envoyé au <span className="font-semibold text-moov-500">+228 {phone}</span>
                </p>
                <button
                  type="button"
                  className="text-xs text-moov-500 hover:underline mb-6"
                  onClick={() => setStep('phone')}
                >
                  Changer de numéro
                </button>

                <div className="form-control mb-4">
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="input input-bordered text-center text-2xl tracking-[8px] rounded-xl border-gray-200 focus:border-moov-500"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    required
                    autoFocus
                  />
                </div>

                {error && <div className="alert alert-error text-sm p-2 mb-4">{error}</div>}

                <button
                  type="submit"
                  className="btn btn-moov w-full gap-2"
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner" /> : <><ArrowRight size={18} /> Se connecter</>}
                </button>

                <div className="flex items-center gap-2 mt-4 justify-center text-xs text-gray-400">
                  <Smartphone size={14} />
                  Paiement par Flooz ou TMoney
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
