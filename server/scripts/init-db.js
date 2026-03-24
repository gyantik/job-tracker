const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const { Pool } = require('pg')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD || ''),
  port: Number(process.env.DB_PORT || 5432),
})

const run = async () => {
  const sqlPath = path.resolve(__dirname, '../db/init.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  try {
    await pool.query(sql)
    console.log('Database schema initialized successfully.')
  } catch (error) {
    console.error('Failed to initialize database schema:', error.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

run()
