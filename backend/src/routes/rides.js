const { Router } = require('express')
const rideController = require('../controllers/rideController')
const { authenticate, requireRole } = require('../middleware/auth')

const router = Router()

router.post('/estimate', authenticate, rideController.estimate)
router.post('/', authenticate, rideController.create)
router.get('/nearby-drivers', authenticate, rideController.findDrivers)
router.get('/', authenticate, rideController.list)
router.get('/active', authenticate, requireRole('DRIVER'), rideController.activeRide)
router.post('/:rideId/accept', authenticate, requireRole('DRIVER'), rideController.accept)
router.patch('/:rideId/status', authenticate, rideController.updateStatus)

module.exports = router
