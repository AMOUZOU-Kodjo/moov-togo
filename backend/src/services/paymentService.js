const { PrismaClient } = require('@prisma/client')
const { config } = require('../config')
const { AppError } = require('../middleware/errorHandler')

const prisma = new PrismaClient()

const processMobileMoneyPayment = async (provider, phone, amount, description) => {
  console.log(`[PAYMENT] Processing ${provider} payment to ${phone}: ${amount} FCFA`)

  return {
    success: true,
    transactionId: `TXN-${Date.now()}`,
    providerRef: `${provider}-${Date.now()}`,
  }
}

const initiatePayment = async (userId, data) => {
  let amount = 0
  let type = ''

  if (data.rideId) {
    const ride = await prisma.ride.findUnique({ where: { id: data.rideId } })
    if (!ride) throw new AppError('Course non trouvée', 404)
    amount = ride.price || 0
    type = 'ride'
  } else if (data.deliveryId) {
    const delivery = await prisma.delivery.findUnique({ where: { id: data.deliveryId } })
    if (!delivery) throw new AppError('Livraison non trouvée', 404)
    amount = delivery.price || 0
    type = 'delivery'
  }

  if (amount <= 0) throw new AppError('Montant invalide', 400)

  const commission = type === 'ride'
    ? (amount * config.commission.ride) / 100
    : type === 'delivery'
    ? (amount * config.commission.food) / 100
    : 0

  const payment = await prisma.payment.create({
    data: {
      userId,
      rideId: data.rideId,
      deliveryId: data.deliveryId,
      amount,
      provider: data.provider,
      providerPhone: data.providerPhone,
      status: 'PENDING',
      commission,
    },
  })

  try {
    const result = await processMobileMoneyPayment(
      data.provider,
      data.providerPhone,
      amount,
      `Moov' Togo - ${type === 'ride' ? 'Course' : 'Livraison'}`
    )

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        transactionId: result.transactionId,
        providerRef: result.providerRef,
        paidAt: new Date(),
      },
    })

    return updated
  } catch (error) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    })
    throw new AppError('Paiement échoué', 400)
  }
}

const getPaymentHistory = async (userId) => {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { ride: true, delivery: true },
  })
}

const getWalletBalance = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new AppError('Utilisateur non trouvé', 404)
  return { balance: user.walletBalance }
}

const payoutToDriver = async (driverId, amount) => {
  const driver = await prisma.user.findUnique({ where: { id: driverId } })
  if (!driver) throw new AppError('Chauffeur non trouvé', 404)

  console.log(`[PAYOUT] Payout ${amount} FCFA to driver ${driverId}`)

  await prisma.user.update({
    where: { id: driverId },
    data: { walletBalance: { decrement: amount } },
  })
}

module.exports = { initiatePayment, getPaymentHistory, getWalletBalance, payoutToDriver }
