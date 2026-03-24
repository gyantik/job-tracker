const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { pool } = require('../src/config/db')
const { seedDemoData } = require('../src/services/seedService')

const seed = async () => {
  try {
    const result = await seedDemoData()
    console.log('Database seed completed successfully.')
    console.log(`Demo login: ${result.demoEmail} / ${result.demoPassword}`)
  } catch (error) {
    console.error('Failed to seed database:', error.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

seed()
