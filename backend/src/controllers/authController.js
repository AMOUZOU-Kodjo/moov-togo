const authService = require('../services/authService')

const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Numéro de téléphone requis' })
    }
    const result = await authService.sendOtp(phone)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const verifyOtp = async (req, res, next) => {
  try {
    const { phone, code } = req.body
    if (!phone || !code) {
      return res.status(400).json({ success: false, message: 'Téléphone et code requis' })
    }
    const result = await authService.verifyOtp(phone, code)
    res.json({ success: true, message: 'Connexion réussie', data: result })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.userId)
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.userId, req.body)
    res.json({ success: true, message: 'Profil mis à jour', data: user })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

module.exports = { sendOtp, verifyOtp, getProfile, updateProfile }
