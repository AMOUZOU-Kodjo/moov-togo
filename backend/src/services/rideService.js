const { PrismaClient } = require('@prisma/client')
const { AppError } = require('../middleware/errorHandler')

const prisma = new PrismaClient()

const BASE_RATE_PER_KM = 200
const BASE_RATE_PER_KM_CAR = 350

const estimatePrice = (distanceKm, vehicleType) => {
  const rate = vehicleType === 'voiture' ? BASE_RATE_PER_KM_CAR : BASE_RATE_PER_KM
  const base = 500
  return base + distanceKm * rate
}

const createRide = async (riderId, data) => {
  const distanceKm = calculateDistance(
    data.pickupLat, data.pickupLng,
    data.dropoffLat, data.dropoffLng
  )
  const price = estimatePrice(distanceKm, data.vehicleType || 'zemidjan')

  const ride = await prisma.ride.create({
    data: {
      riderId,
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      pickupAddress: data.pickupAddress,
      dropoffLat: data.dropoffLat,
      dropoffLng: data.dropoffLng,
      dropoffAddress: data.dropoffAddress,
      vehicleType: data.vehicleType || 'zemidjan',
      distanceKm,
      price: Math.round(price),
      durationMin: Math.round(distanceKm * 3),
      status: 'PENDING',
    },
    include: { rider: true },
  })

  return ride
}

const findNearbyDrivers = async (lat, lng, radiusKm = 3) => {
  const drivers = await prisma.user.findMany({
    where: {
      role: 'DRIVER',
      isOnline: true,
      lastLat: { not: null },
      lastLng: { not: null },
    },
  })

  return drivers.filter((d) => {
    if (!d.lastLat || !d.lastLng) return false
    const dist = calculateDistance(lat, lng, d.lastLat, d.lastLng)
    return dist <= radiusKm
  })
}

const acceptRide = async (rideId, driverId) => {
  const ride = await prisma.ride.findUnique({ where: { id: rideId } })
  if (!ride) throw new AppError('Course non trouvée', 404)
  if (ride.status !== 'PENDING') throw new AppError('Course déjà prise', 400)

  return prisma.ride.update({
    where: { id: rideId },
    data: { driverId, status: 'ACCEPTED' },
    include: { rider: true, driver: true },
  })
}

const updateRideStatus = async (rideId, status) => {
  const data = { status }
  if (status === 'IN_PROGRESS') data.startedAt = new Date()
  if (status === 'COMPLETED') data.completedAt = new Date()
  if (status === 'CANCELLED') data.cancelledAt = new Date()

  return prisma.ride.update({
    where: { id: rideId },
    data,
    include: { rider: true, driver: true },
  })
}

const getUserRides = async (userId) => {
  return prisma.ride.findMany({
    where: {
      OR: [{ riderId: userId }, { driverId: userId }],
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { rider: true, driver: true, payment: true },
  })
}

const getDriverActiveRide = async (driverId) => {
  return prisma.ride.findFirst({
    where: {
      driverId,
      status: { in: ['ACCEPTED', 'ARRIVED', 'IN_PROGRESS'] },
    },
    include: { rider: true, payment: true },
  })
}

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

module.exports = { estimatePrice, createRide, findNearbyDrivers, acceptRide, updateRideStatus, getUserRides, getDriverActiveRide }
