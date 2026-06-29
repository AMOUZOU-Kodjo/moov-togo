import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bike, Navigation, Power, Clock, DollarSign, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useGeolocation from '../hooks/useGeolocation'
import { connectSocket, disconnectSocket } from '../services/socket'
import MapView from '../components/MapView'
import { rides } from '../services/api'

export default function Drivers() {
  const { user } = useAuth()
  const { location: gps, error: gpsError } = useGeolocation()
  const [online, setOnline] = useState(false)
  const [requests, setRequests] = useState([])
  const [activeRide, setActiveRide] = useState(null)

  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('moov_token')
    const socket = connectSocket(token)
    const unsubRide = (data) => {
      setRequests(prev => {
        if (prev.some(r => r.id === data.id)) return prev
        return [data, ...prev]
      })
    }
    const unsubAccept = (data) => {
      setRequests(prev => prev.filter(r => r.id !== data.rideId))
      setActiveRide(data)
    }
    socket.on('ride:request', unsubRide)
    socket.on('ride:accepted', unsubAccept)
    return () => {
      socket.off('ride:request', unsubRide)
      socket.off('ride:accepted', unsubAccept)
    }
  }, [user])

  useEffect(() => {
    if (!online || !gps) return
    fetchActiveRide()
  }, [online, gps])

  const fetchActiveRide = async () => {
    try {
      const res = await rides.activeRide()
      if (res.data.data) setActiveRide(res.data.data)
    } catch {}
  }

  const toggleOnline = useCallback(() => {
    setOnline(prev => !prev)
    if (!online && user) {
      const socket = connectSocket(localStorage.getItem('moov_token'))
      socket.emit('driver:status', { online: true })
    }
  }, [online, user])

  const acceptRide = async (rideId) => {
    try {
      const res = await rides.acceptRide(rideId)
      const socket = connectSocket(localStorage.getItem('moov_token'))
      socket.emit('ride:accepted', { rideId })
      setRequests(prev => prev.filter(r => r.id !== rideId))
      setActiveRide(res.data.data)
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className={`px-4 pt-6 pb-6 rounded-b-3xl text-white ${activeRide ? 'bg-accent' : 'bg-moov-500'}`}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Moov' Chauffeur</h1>
            <p className="text-xs opacity-80">{user?.name || 'Chauffeur'}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleOnline}
            className={`btn btn-sm gap-2 rounded-xl border-none ${
              online ? 'bg-success text-white shadow-lg shadow-success/50' : 'bg-gray-200 text-gray-500'
            }`}
          >
            <motion.span
              animate={online ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Power size={14} />
            </motion.span>
            {online ? 'En ligne' : 'Hors ligne'}
          </motion.button>
        </div>
      </motion.header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {gps && online && (
          <MapView
            center={[gps.lat, gps.lng]}
            pickup={{ lat: gps.lat, lng: gps.lng, address: 'Votre position' }}
            zoom={14}
            height="200px"
            className="w-full"
          />
        )}

        {gpsError && <div className="alert alert-warning text-sm">GPS: {gpsError}</div>}

        <AnimatePresence mode="wait">
          {activeRide ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="card-moov border-l-4 border-accent"
            >
              <h3 className="font-bold text-accent mb-2">Course en cours</h3>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2"><MapPin size={14} className="text-moov-500" /> {activeRide.pickupAddress}</p>
                <p className="flex items-center gap-2"><MapPin size={14} className="text-secondary" /> {activeRide.dropoffAddress}</p>
                <div className="flex gap-4 pt-2 text-gray-500">
                  <span className="flex items-center gap-1"><Navigation size={14} /> {activeRide.distanceKm?.toFixed(1)} km</span>
                  <span className="flex items-center gap-1"><DollarSign size={14} /> {activeRide.price?.toLocaleString()} F</span>
                </div>
              </div>
            </motion.div>
          ) : online ? (
            <motion.div key="online" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="card-moov flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Navigation size={24} className="text-moov-500" />
                  <div>
                    <p className="font-bold">En attente de courses</p>
                    <p className="text-sm text-gray-400">Chauffeurs à proximité: {requests.length}</p>
                  </div>
                </div>
                <span className="loading loading-ring loading-md text-moov-500" />
              </motion.div>

              {requests.length > 0 && (
                <>
                  <h3 className="font-bold text-sm text-gray-500 px-1 pt-2">Demandes à proximité</h3>
                  <AnimatePresence>
                    {requests.map((r, i) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ delay: i * 0.1 }}
                        className="card bg-white rounded-2xl shadow-sm p-4"
                      >
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <Bike size={16} className="text-secondary" />
                          <span className="font-medium truncate">{r.pickupAddress || r.from}</span>
                          <span className="text-gray-300 shrink-0">→</span>
                          <span className="font-medium truncate">{r.dropoffAddress || r.to}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock size={12} /> {r.distanceKm || r.dist}</span>
                            <span className="flex items-center gap-1"><DollarSign size={12} /> {(r.price || 0).toLocaleString()} F</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => acceptRide(r.id)}
                            className="btn btn-sm btn-moov rounded-xl"
                          >
                            Accepter
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="offline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card-moov text-center py-10"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <Bike size={48} className="mx-auto text-gray-300 mb-3" />
              </motion.div>
              <p className="text-gray-400">Passez en ligne pour recevoir des demandes</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
