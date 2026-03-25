const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const devRoutes = require('./routes/devRoutes')

const app = express()

const normalizeOrigin = (value) => value.replace(/\/$/, '')

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .map(normalizeOrigin)
  .filter(Boolean)

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  console.warn('[CORS] No allowed origins configured. Set CORS_ORIGINS for production browser access.')
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true)
    }

    const normalizedOrigin = normalizeOrigin(origin)

    if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true)
    }

    return callback(new Error('CORS origin not allowed'))
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ message: 'API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/dev', devRoutes)

module.exports = app
