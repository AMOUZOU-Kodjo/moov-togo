const rideService = require('../services/rideService')

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const toRad = (deg) => (deg * Math.PI) / 180

const estimate = async (req, res, next) => {
  try {
    const { pickupLat, pickupLng, dropoffLat, dropoffLng, vehicleType } = req.body
    const distanceKm = calculateDistance(pickupLat, pickupLng, dropoffLat, dropoffLng)
    const price = rideService.estimatePrice(distanceKm, vehicleType || 'zemidjan')
    res.json({
      success: true,
      data: {
        distanceKm: Math.round(distanceKm * 10) / 10,
        durationMin: Math.round(distanceKm * 3),
        price: Math.round(price),
        currency: 'FCFA',
      },
    })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const ride = await rideService.createRide(req.userId, req.body)
    res.status(201).json({ success: true, message: 'Course créée', data: ride })
  } catch (error) {
    next(error)
  }
}

const findDrivers = async (req, res, next) => {
  try {
    const { lat, lng } = req.query
    const drivers = await rideService.findNearbyDrivers(
      parseFloat(lat),
      parseFloat(lng)
    )
    res.json({ success: true, data: drivers })
  } catch (error) {
    next(error)
  }
}

const accept = async (req, res, next) => {
  try {
    const { rideId } = req.params
    const ride = await rideService.acceptRide(rideId, req.userId)
    res.json({ success: true, message: 'Course acceptée', data: ride })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const updateStatus = async (req, res, next) => {
  try {
    const { rideId } = req.params
    const { status } = req.body
    const ride = await rideService.updateRideStatus(rideId, status)
    res.json({ success: true, data: ride })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const list = async (req, res, next) => {
  try {
    const rides = await rideService.getUserRides(req.userId)
    res.json({ success: true, data: rides })
  } catch (error) {
    next(error)
  }
}

const activeRide = async (req, res, next) => {
  try {
    const ride = await rideService.getDriverActiveRide(req.userId)
    res.json({ success: true, data: ride })
  } catch (error) {
    next(error)
  }
}

module.exports = { estimate, create, findDrivers, accept, updateStatus, list, activeRide }
