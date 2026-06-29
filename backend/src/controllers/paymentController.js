const paymentService = require('../services/paymentService')

const pay = async (req, res, next) => {
  try {
    const payment = await paymentService.initiatePayment(req.userId, req.body)
    res.json({ success: true, message: 'Paiement effectué', data: payment })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const history = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentHistory(req.userId)
    res.json({ success: true, data: payments })
  } catch (error) {
    next(error)
  }
}

const wallet = async (req, res, next) => {
  try {
    const balance = await paymentService.getWalletBalance(req.userId)
    res.json({ success: true, data: balance })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

module.exports = { pay, history, wallet }
