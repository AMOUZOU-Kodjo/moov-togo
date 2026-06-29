import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Smartphone, ChevronLeft } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-moov-500 to-moov-600 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm lg:max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-extrabold text-white">Moov'</h1>
            <p className="text-white/70 text-lg">Togo</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 lg:p-8 shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.form
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSendOtp}
                >
                  <h2 className="text-lg lg:text-xl font-bold mb-1">Connexion</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Entrez votre numéro pour recevoir un code
                  </p>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-medium">Numéro de téléphone</span>
                    </label>
                    <div className="join w-full">
                      <span className="join-item btn btn-disabled bg-gray-100 border-gray-200 text-gray-600 px-3 rounded-l-xl">
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
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && <div className="alert alert-error text-sm p-2 mb-4">{error}</div>}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="btn btn-moov w-full gap-2"
                    disabled={loading}
                  >
                    {loading ? <span className="loading loading-spinner" /> : <><Smartphone size={18} /> Envoyer le code</>}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerify}
                >
                  <h2 className="text-lg lg:text-xl font-bold mb-1">Code de vérification</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Code envoyé au <span className="font-semibold text-moov-500">+228 {phone}</span>
                  </p>
                  <button
                    type="button"
                    className="text-xs text-moov-500 hover:underline mb-6 flex items-center gap-1"
                    onClick={() => setStep('phone')}
                  >
                    <ChevronLeft size={14} /> Changer de numéro
                  </button>

                  <div className="form-control mb-4">
                    <input
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      className="input input-bordered text-center text-2xl lg:text-3xl tracking-[10px] rounded-xl border-gray-200 focus:border-moov-500"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      required
                      autoFocus
                    />
                  </div>

                  {error && <div className="alert alert-error text-sm p-2 mb-4">{error}</div>}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="btn btn-moov w-full gap-2"
                    disabled={loading}
                  >
                    {loading ? <span className="loading loading-spinner" /> : <><ArrowRight size={18} /> Se connecter</>}
                  </motion.button>

                  <div className="flex items-center gap-2 mt-4 justify-center text-xs text-gray-400">
                    <Smartphone size={14} />
                    Paiement par Flooz ou TMoney
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
