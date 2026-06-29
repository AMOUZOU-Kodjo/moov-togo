const { Router } = require('express')
const paymentController = require('../controllers/paymentController')
const { authenticate } = require('../middleware/auth')

const router = Router()

router.post('/pay', authenticate, paymentController.pay)
router.get('/history', authenticate, paymentController.history)
router.get('/wallet', authenticate, paymentController.wallet)

module.exports = router
