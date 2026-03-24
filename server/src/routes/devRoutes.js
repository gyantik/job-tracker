const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { seedDemoData } = require('../services/seedService')

const router = express.Router()

router.post('/reset-seed', protect, async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' })
  }

  const expectedKey = process.env.DEV_RESET_KEY
  if (expectedKey) {
    const receivedKey = req.headers['x-reset-key']
    if (receivedKey !== expectedKey) {
      return res.status(403).json({ error: 'Invalid reset key' })
    }
  }

  try {
    const result = await seedDemoData()
    return res.json({
      message: 'Seed reset successfully',
      demoEmail: result.demoEmail,
      demoPassword: result.demoPassword,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router
