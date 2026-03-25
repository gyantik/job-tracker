const dotenv = require('dotenv')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') })
}

const { connectDB } = require('./config/db')
const app = require('./app')

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})
