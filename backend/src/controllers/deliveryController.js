const deliveryService = require('../services/deliveryService')

const searchCantines = async (req, res, next) => {
  try {
    const { lat, lng } = req.query
    const cantines = await deliveryService.getNearbyCantines(
      parseFloat(lat),
      parseFloat(lng)
    )
    res.json({ success: true, data: cantines })
  } catch (error) {
    next(error)
  }
}

const orderFood = async (req, res, next) => {
  try {
    const delivery = await deliveryService.createFoodDelivery(req.userId, req.body)
    res.status(201).json({ success: true, message: 'Commande créée', data: delivery })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const sendParcel = async (req, res, next) => {
  try {
    const delivery = await deliveryService.createParcelDelivery(req.userId, req.body)
    res.status(201).json({ success: true, message: 'Envoi créé', data: delivery })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const acceptDelivery = async (req, res, next) => {
  try {
    const { deliveryId } = req.params
    const delivery = await deliveryService.acceptDelivery(deliveryId, req.userId)
    res.json({ success: true, message: 'Livraison acceptée', data: delivery })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const updateStatus = async (req, res, next) => {
  try {
    const { deliveryId } = req.params
    const { status } = req.body
    const delivery = await deliveryService.updateDeliveryStatus(deliveryId, status)
    res.json({ success: true, data: delivery })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const list = async (req, res, next) => {
  try {
    const deliveries = await deliveryService.getUserDeliveries(req.userId)
    res.json({ success: true, data: deliveries })
  } catch (error) {
    next(error)
  }
}

module.exports = { searchCantines, orderFood, sendParcel, acceptDelivery, updateStatus, list }
