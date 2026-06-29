class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }

  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
  })
}

module.exports = { AppError, errorHandler }
