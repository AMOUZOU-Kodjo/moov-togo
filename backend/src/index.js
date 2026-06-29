const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const http = require('http')
const { config } = require('./config')
const routes = require('./routes')
const { errorHandler } = require('./middleware/errorHandler')
const { initializeSocket } = require('./services/socketService')

const app = express()
const httpServer = http.createServer(app)

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Trop de requêtes, réessayez plus tard' },
})
app.use('/api', limiter)

app.use('/api', routes)

app.use(errorHandler)

initializeSocket(httpServer)

httpServer.listen(config.port, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║     Moov' Togo API - v1.0.0          ║
  ║     Running on port ${config.port}         ║
  ╚═══════════════════════════════════════╝
  `)
})

module.exports = app
