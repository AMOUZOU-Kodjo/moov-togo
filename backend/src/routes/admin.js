const { Router } = require('express')
const adminController = require('../controllers/adminController')
const { authenticate, requireRole } = require('../middleware/auth')

const router = Router()

router.get('/dashboard', authenticate, requireRole('ADMIN'), adminController.dashboard)
router.get('/users', authenticate, requireRole('ADMIN'), adminController.users)
router.get('/payments', authenticate, requireRole('ADMIN'), adminController.payments)

module.exports = router
