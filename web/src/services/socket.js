import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || '/api'
const SOCKET_URL = API_URL.replace('/api', '')

let socket = null

export function connectSocket(token) {
  if (socket?.connected) return socket
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  })
  socket.on('connect', () => console.log('[Socket] connecté'))
  socket.on('disconnect', () => console.log('[Socket] déconnecté'))
  socket.on('connect_error', (err) => console.warn('[Socket] erreur:', err.message))
  return socket
}

export function disconnectSocket() {
  if (socket) { socket.disconnect(); socket = null }
}

export function getSocket() { return socket }

export function emitLocation(userId, lat, lng) {
  if (socket?.connected) socket.emit('location:update', { userId, lat, lng })
}

export function onRideRequest(cb) {
  socket?.on('ride:request', cb)
  return () => socket?.off('ride:request', cb)
}

export function onRideAccepted(cb) {
  socket?.on('ride:accepted', cb)
  return () => socket?.off('ride:accepted', cb)
}

export function onRideStatus(cb) {
  socket?.on('ride:status', cb)
  return () => socket?.off('ride:status', cb)
}

export function onDeliveryNew(cb) {
  socket?.on('delivery:new', cb)
  return () => socket?.off('delivery:new', cb)
}

export function onDeliveryStatus(cb) {
  socket?.on('delivery:status', cb)
  return () => socket?.off('delivery:status', cb)
}

export function emitRideRequest(data) {
  socket?.emit('ride:request', data)
}

export function emitRideAccept(rideId) {
  socket?.emit('ride:accepted', { rideId })
}
