if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { connectDB, initDB } = require('./config/db')
const app = require('./app')

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()
  await initDB()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})
