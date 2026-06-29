const { Router } = require('express')
const deliveryController = require('../controllers/deliveryController')
const { authenticate, requireRole } = require('../middleware/auth')

const router = Router()

router.get('/cantines', authenticate, deliveryController.searchCantines)
router.post('/food', authenticate, deliveryController.orderFood)
router.post('/parcel', authenticate, deliveryController.sendParcel)
router.get('/', authenticate, deliveryController.list)
router.post('/:deliveryId/accept', authenticate, requireRole('DRIVER'), deliveryController.acceptDelivery)
router.patch('/:deliveryId/status', authenticate, deliveryController.updateStatus)

module.exports = router
