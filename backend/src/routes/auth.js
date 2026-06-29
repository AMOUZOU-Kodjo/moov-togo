const { Router } = require('express')
const authController = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')

const router = Router()

router.post('/send-otp', authController.sendOtp)
router.post('/verify-otp', authController.verifyOtp)
router.get('/profile', authenticate, authController.getProfile)
router.put('/profile', authenticate, authController.updateProfile)

module.exports = router
