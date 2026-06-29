import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('moov_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('moov_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const auth = {
  sendOtp: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (phone, code) => api.post('/auth/verify-otp', { phone, code }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

export const rides = {
  estimate: (data) => api.post('/rides/estimate', data),
  create: (data) => api.post('/rides', data),
  list: () => api.get('/rides'),
  activeRide: () => api.get('/rides/active'),
  acceptRide: (id) => api.post(`/rides/${id}/accept`),
  updateStatus: (id, status) => api.patch(`/rides/${id}/status`, { status }),
}

export const deliveries = {
  getCantines: (lat, lng) => {
    const params = lat && lng ? `?lat=${lat}&lng=${lng}` : ''
    return api.get(`/deliveries/cantines${params}`)
  },
  orderFood: (data) => api.post('/deliveries/food', data),
  sendParcel: (data) => api.post('/deliveries/parcel', data),
  list: () => api.get('/deliveries'),
  acceptDelivery: (id) => api.post(`/deliveries/${id}/accept`),
  updateStatus: (id, status) => api.patch(`/deliveries/${id}/status`, { status }),
}

export const payments = {
  pay: (data) => api.post('/payments/pay', data),
  history: () => api.get('/payments/history'),
  wallet: () => api.get('/payments/wallet'),
}

export default api
