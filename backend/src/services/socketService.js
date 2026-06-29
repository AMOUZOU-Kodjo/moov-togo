const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const { config } = require('../config')

let io

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Token manquant'))
    }
    try {
      const decoded = jwt.verify(token, config.jwt.secret)
      socket.userId = decoded.userId
      socket.userRole = decoded.role
      next()
    } catch {
      next(new Error('Token invalide'))
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.userId
    const userRole = socket.userRole
    console.log(`[Socket] ${userRole} ${userId} connected`)

    socket.join(`user:${userId}`)

    if (userRole === 'DRIVER') {
      socket.join('drivers')
      socket.on('location:update', (data) => {
        socket.broadcast.to('dispatchers').emit('driver:location', {
          driverId: userId,
          lat: data.lat,
          lng: data.lng,
        })
      })
    }

    if (userRole === 'CLIENT') {
      socket.join('clients')
    }

    socket.on('ride:request', (data) => {
      io.to('drivers').emit('ride:new', {
        rideId: data.rideId,
        pickup: data.pickup,
        dropoff: data.dropoff,
        price: data.price,
      })
    })

    socket.on('ride:accepted', (data) => {
      io.to(`user:${data.driverId}`).emit('ride:accepted', data)
    })

    socket.on('ride:status', (data) => {
      io.to('clients').emit('ride:status-update', data)
    })

    socket.on('delivery:new', (data) => {
      io.to('drivers').emit('delivery:available', data)
    })

    socket.on('delivery:status', (data) => {
      io.to('clients').emit('delivery:status-update', data)
    })

    socket.on('disconnect', () => {
      console.log(`[Socket] ${userId} disconnected`)
    })
  })

  return io
}

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized')
  return io
}

module.exports = { initializeSocket, getIO }
