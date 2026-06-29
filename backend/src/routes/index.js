const { Router } = require('express')
const authRoutes = require('./auth')
const rideRoutes = require('./rides')
const deliveryRoutes = require('./deliveries')
const paymentRoutes = require('./payments')

const router = Router()

router.use('/auth', authRoutes)
router.use('/rides', rideRoutes)
router.use('/deliveries', deliveryRoutes)
router.use('/payments', paymentRoutes)

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

module.exports = router
