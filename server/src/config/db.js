const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL
let tablesInitialized = false

const poolConfig = connectionString
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: String(process.env.DB_PASSWORD || ''),
      port: Number(process.env.DB_PORT || 5432),
      ssl: false,
    }

const pool = new Pool(poolConfig)

const initDB = async () => {
  if (tablesInitialized) {
    return
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT,
        applied_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    tablesInitialized = true
    console.log('Tables ensured')
  } catch (error) {
    console.error('Failed to ensure database tables:', error.message)
    throw error
  }
}

const connectDB = async () => {
  if (process.env.NODE_ENV === 'production' && !connectionString) {
    console.error('PostgreSQL connection error: DATABASE_URL is required in production')
    process.exit(1)
  }

  if (!connectionString && (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PASSWORD)) {
    console.error('PostgreSQL connection error: Missing DATABASE_URL or DB_USER/DB_HOST/DB_NAME/DB_PASSWORD environment variables')
    process.exit(1)
  }

  try {
    await pool.query('SELECT 1')
    console.log('PostgreSQL connected')
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      if (connectionString) {
        console.error('PostgreSQL connection error: Cannot reach PostgreSQL using DATABASE_URL')
      } else {
        console.error('PostgreSQL connection error: Cannot reach PostgreSQL at', `${process.env.DB_HOST}:${process.env.DB_PORT || 5432}`)
      }
      console.error('Hint: Verify database environment variables and network access from the deployment environment')
    } else {
      console.error('PostgreSQL connection error:', error.message)
    }
    process.exit(1)
  }
}

module.exports = { connectDB, initDB, pool }
