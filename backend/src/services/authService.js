const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')
const { config } = require('../config')

const prisma = new PrismaClient()

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString()

const normalizePhone = (phone) => {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 8) return '+228' + digits
  if (digits.length === 11 && digits.startsWith('228')) return '+' + digits
  if (digits.length === 12 && digits.startsWith('228')) return '+' + digits
  if (phone.startsWith('+')) return phone
  return '+' + digits
}

const sendOtp = async (phone) => {
  phone = normalizePhone(phone)
  const code = generateCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.otpCode.create({
    data: { phone, code, expiresAt },
  })

  console.log(`[OTP] Code for ${phone}: ${code}`)
  return { success: true, message: 'Code envoyé' }
}

const verifyOtp = async (phone, code) => {
  phone = normalizePhone(phone)

  // Dev bypass: code 123456 always works
  if (code !== '123456') {
    const otp = await prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!otp) {
      throw new Error('Code invalide ou expiré')
    }

    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { isUsed: true },
    })
  }

  let user = await prisma.user.findUnique({ where: { phone } })
  if (!user) {
    user = await prisma.user.create({
      data: { phone, role: 'CLIENT' },
    })
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    })
  }

  const token = jwt.sign(
    { userId: user.id, phone: user.phone, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )

  return { token, user: sanitizeUser(user) }
}

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      vehicles: true,
      driverDocuments: true,
    },
  })
  if (!user) throw new Error('Utilisateur non trouvé')
  return sanitizeUser(user)
}

const updateProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  })
  return sanitizeUser(user)
}

const sanitizeUser = (user) => {
  const { passwordHash, fcmToken, ...safe } = user
  return safe
}

module.exports = { sendOtp, verifyOtp, getProfile, updateProfile }
