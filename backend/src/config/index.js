const dotenv = require('dotenv')
dotenv.config()

const config = {
  port: parseInt(process.env.PORT || '4000'),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
  flooz: {
    apiKey: process.env.FLOOZ_API_KEY || '',
    apiSecret: process.env.FLOOZ_API_SECRET || '',
    apiUrl: process.env.FLOOZ_API_URL || 'https://api.flooz.tg/v1',
  },
  tmoney: {
    apiKey: process.env.TMONEY_API_KEY || '',
    apiSecret: process.env.TMONEY_API_SECRET || '',
    apiUrl: process.env.TMONEY_API_URL || 'https://api.tmoney.tg/v1',
  },
  mapbox: {
    accessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
  },
  commission: {
    ride: parseInt(process.env.PLATFORM_COMMISSION_RIDE || '15'),
    food: parseInt(process.env.PLATFORM_COMMISSION_FOOD || '10'),
    parcel: parseInt(process.env.PLATFORM_COMMISSION_PARCEL || '12'),
  },
}

module.exports = { config }
