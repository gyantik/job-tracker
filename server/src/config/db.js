const { Pool } = require('pg')

const isTrue = (value) => String(value).toLowerCase() === 'true'

const dbSslEnabled = isTrue(process.env.DB_SSL)
const rejectUnauthorized = !String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase().includes('false')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD || ''),
  port: Number(process.env.DB_PORT || 5432),
  ssl: dbSslEnabled ? { rejectUnauthorized } : false,
})

const connectDB = async () => {
  if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PASSWORD) {
    console.error('PostgreSQL connection error: Missing DB_USER/DB_HOST/DB_NAME/DB_PASSWORD environment variables')
    process.exit(1)
  }

  try {
    await pool.query('SELECT 1')
    console.log('PostgreSQL connected')
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('PostgreSQL connection error: Cannot reach PostgreSQL at', `${process.env.DB_HOST}:${process.env.DB_PORT || 5432}`)
      console.error('Hint: Start a local PostgreSQL server and verify credentials in server/.env')
    } else {
      console.error('PostgreSQL connection error:', error.message)
    }
    process.exit(1)
  }
}

module.exports = { connectDB, pool }
