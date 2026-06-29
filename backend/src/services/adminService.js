const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getStats = async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalUsers, totalDrivers, totalCantines,
    totalRides, todayRides, totalDeliveries,
    todayDeliveries, totalPayments, todayPayments,
    onlineDrivers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'DRIVER' } }),
    prisma.cantine.count(),
    prisma.ride.count(),
    prisma.ride.count({ where: { createdAt: { gte: today } } }),
    prisma.delivery.count(),
    prisma.delivery.count({ where: { createdAt: { gte: today } } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { role: 'DRIVER', isOnline: true } }),
  ])

  return {
    totalUsers,
    totalDrivers,
    totalCantines,
    totalRides,
    todayRides,
    totalDeliveries,
    todayDeliveries,
    totalRevenue: totalPayments._sum.amount || 0,
    todayRevenue: todayPayments._sum.amount || 0,
    onlineDrivers,
  }
}

const getMonthlyData = async () => {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const rides = await prisma.ride.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true, price: true },
  })

  const deliveries = await prisma.delivery.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true, price: true },
  })

  const months = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    months[key] = { m: d.toLocaleString('fr-FR', { month: 'short' }), courses: 0, livraisons: 0, revenus: 0 }
  }

  rides.forEach(r => {
    const key = `${r.createdAt.getFullYear()}-${r.createdAt.getMonth()}`
    if (months[key]) {
      months[key].courses += 1
      months[key].revenus += r.price || 0
    }
  })

  deliveries.forEach(d => {
    const key = `${d.createdAt.getFullYear()}-${d.createdAt.getMonth()}`
    if (months[key]) {
      months[key].livraisons += 1
    }
  })

  return Object.values(months)
}

const getServiceBreakdown = async () => {
  const [rides, foodDeliveries, parcelDeliveries] = await Promise.all([
    prisma.ride.count({ where: { status: 'COMPLETED' } }),
    prisma.delivery.count({ where: { orderType: 'FOOD', status: 'DELIVERED' } }),
    prisma.delivery.count({ where: { orderType: 'PARCEL', status: 'DELIVERED' } }),
  ])
  const total = rides + foodDeliveries + parcelDeliveries || 1
  return [
    { label: 'Courses', value: Math.round((rides / total) * 100), color: 'bg-secondary' },
    { label: 'Repas', value: Math.round((foodDeliveries / total) * 100), color: 'bg-moov-500' },
    { label: 'Colis', value: Math.round((parcelDeliveries / total) * 100), color: 'bg-accent' },
  ]
}

const getRecentActivity = async (limit = 10) => {
  const [recentRides, recentDeliveries] = await Promise.all([
    prisma.ride.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { rider: { select: { name: true } }, driver: { select: { name: true } } },
    }),
    prisma.delivery.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { sender: { select: { name: true } }, cantine: { select: { name: true } } },
    }),
  ])

  const activity = [
    ...recentRides.map(r => ({
      type: 'ride',
      id: r.id,
      user: r.rider?.name || 'Client',
      driver: r.driver?.name || null,
      action: r.status === 'COMPLETED' ? 'Course terminée' : r.status === 'CANCELLED' ? 'Course annulée' : 'Course en cours',
      status: r.status === 'COMPLETED' ? 'Terminé' : r.status === 'CANCELLED' ? 'Annulé' : r.status === 'ACCEPTED' ? 'Accepté' : 'En cours',
      amount: `${(r.price || 0).toLocaleString()} F`,
      createdAt: r.createdAt,
    })),
    ...recentDeliveries.map(d => ({
      type: 'delivery',
      id: d.id,
      user: d.sender?.name || 'Client',
      action: d.orderType === 'FOOD' ? `Commande ${d.cantine?.name || 'repas'}` : 'Envoi colis',
      status: d.status === 'DELIVERED' ? 'Livré' : d.status === 'CANCELLED' ? 'Annulé' : d.status === 'IN_TRANSIT' ? 'En transit' : 'En cours',
      amount: `${(d.price || 0).toLocaleString()} F`,
      createdAt: d.createdAt,
    })),
  ]

  activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return activity.slice(0, limit)
}

const getUsers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { sentRides: true, sentDeliveries: true, payments: true } },
      },
    }),
    prisma.user.count(),
  ])
  return { users, total, page, totalPages: Math.ceil(total / limit) }
}

const getPayments = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, phone: true } } },
    }),
    prisma.payment.count(),
  ])
  return { payments, total, page, totalPages: Math.ceil(total / limit) }
}

module.exports = { getStats, getMonthlyData, getServiceBreakdown, getRecentActivity, getUsers, getPayments }
