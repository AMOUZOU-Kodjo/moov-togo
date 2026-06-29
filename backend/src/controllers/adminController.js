const adminService = require('../services/adminService')

const dashboard = async (req, res, next) => {
  try {
    const [stats, monthly, breakdown, recent] = await Promise.all([
      adminService.getStats(),
      adminService.getMonthlyData(),
      adminService.getServiceBreakdown(),
      adminService.getRecentActivity(),
    ])
    res.json({ success: true, data: { stats, monthly, breakdown, recent } })
  } catch (error) {
    next(error)
  }
}

const users = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const result = await adminService.getUsers(page)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

const payments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const result = await adminService.getPayments(page)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { dashboard, users, payments }
