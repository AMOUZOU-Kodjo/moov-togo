const { PrismaClient } = require('@prisma/client')
const { AppError } = require('../middleware/errorHandler')

const prisma = new PrismaClient()

const FOOD_DELIVERY_FEE = 500
const PARCEL_BASE_FEE = 1000
const PARCEL_PER_KM = 150

const calculateDeliveryPrice = (distanceKm, type, itemsTotal) => {
  if (type === 'FOOD') {
    return FOOD_DELIVERY_FEE
  }
  return PARCEL_BASE_FEE + distanceKm * PARCEL_PER_KM
}

const getNearbyCantines = async (lat, lng, radiusKm = 5) => {
  const cantines = await prisma.cantine.findMany({
    where: { isOpen: true },
    include: {
      menuItems: { where: { isAvailable: true } },
      owner: true,
    },
  })

  return cantines.filter((c) => {
    if (!c.lat || !c.lng) return false
    const dist = calculateDistance(lat, lng, c.lat, c.lng)
    return dist <= radiusKm
  })
}

const createFoodDelivery = async (senderId, data) => {
  const cantine = await prisma.cantine.findUnique({
    where: { id: data.cantineId },
    include: { menuItems: true },
  })
  if (!cantine) throw new AppError('Cantine non trouvée', 404)

  const distanceKm = calculateDistance(
    cantine.lat || data.dropoffLat,
    cantine.lng || data.dropoffLng,
    data.dropoffLat,
    data.dropoffLng
  )

  let itemsTotal = 0
  const deliveryItems = data.items.map((item) => {
    const menuItem = cantine.menuItems.find((m) => m.id === item.menuItemId)
    if (!menuItem) throw new AppError(`Menu item ${item.menuItemId} non trouvé`, 404)
    const total = menuItem.price * item.quantity
    itemsTotal += total
    return {
      menuItemId: menuItem.id,
      name: menuItem.name,
      quantity: item.quantity,
      price: total,
    }
  })

  const deliveryFee = calculateDeliveryPrice(distanceKm, 'FOOD')

  const delivery = await prisma.delivery.create({
    data: {
      orderType: 'FOOD',
      senderId,
      cantineId: data.cantineId,
      pickupLat: cantine.lat || 0,
      pickupLng: cantine.lng || 0,
      pickupAddress: cantine.address,
      dropoffLat: data.dropoffLat,
      dropoffLng: data.dropoffLng,
      dropoffAddress: data.dropoffAddress,
      status: 'PENDING',
      distanceKm,
      price: Math.round(itemsTotal + deliveryFee),
      deliveryFee,
      note: data.note,
      items: {
        create: deliveryItems,
      },
    },
    include: {
      cantine: { include: { menuItems: true } },
      items: true,
    },
  })

  return delivery
}

const createParcelDelivery = async (senderId, data) => {
  const distanceKm = calculateDistance(
    data.pickupLat, data.pickupLng,
    data.dropoffLat, data.dropoffLng
  )
  const price = calculateDeliveryPrice(distanceKm, 'PARCEL')

  const delivery = await prisma.delivery.create({
    data: {
      orderType: 'PARCEL',
      senderId,
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      pickupAddress: data.pickupAddress,
      dropoffLat: data.dropoffLat,
      dropoffLng: data.dropoffLng,
      dropoffAddress: data.dropoffAddress,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      status: 'PENDING',
      distanceKm,
      price: Math.round(price),
      deliveryFee: Math.round(price),
      note: data.note,
    },
    include: { sender: true },
  })

  return delivery
}

const acceptDelivery = async (deliveryId, delivererId) => {
  const delivery = await prisma.delivery.findUnique({ where: { id: deliveryId } })
  if (!delivery) throw new AppError('Livraison non trouvée', 404)
  if (delivery.status !== 'PENDING') throw new AppError('Livraison déjà attribuée', 400)

  return prisma.delivery.update({
    where: { id: deliveryId },
    data: { delivererId, status: 'PREPARING' },
    include: { sender: true, deliverer: true, cantine: true, items: true },
  })
}

const updateDeliveryStatus = async (deliveryId, status) => {
  const data = { status }
  if (status === 'PICKED_UP') data.pickedUpAt = new Date()
  if (status === 'DELIVERED') data.deliveredAt = new Date()
  if (status === 'CANCELLED') data.cancelledAt = new Date()

  return prisma.delivery.update({
    where: { id: deliveryId },
    data,
    include: { sender: true, deliverer: true, cantine: true, items: true },
  })
}

const getUserDeliveries = async (userId) => {
  return prisma.delivery.findMany({
    where: {
      OR: [{ senderId: userId }, { delivererId: userId }],
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      sender: true,
      deliverer: true,
      cantine: true,
      items: true,
      payment: true,
    },
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

module.exports = { calculateDeliveryPrice, getNearbyCantines, createFoodDelivery, createParcelDelivery, acceptDelivery, updateDeliveryStatus, getUserDeliveries }
