const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123')
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Register
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const hashed = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashed]
    )
    res.json({ message: 'User created!', user: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) return res.status(401).json({ error: 'User not found' })
    const user = result.rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Wrong password' })
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' })
    res.json({ message: 'Logged in!', token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all applications
app.get('/applications', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add application
app.post('/applications', auth, async (req, res) => {
  const { company, role, status, applied_date, notes } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO applications (user_id, company, role, status, applied_date, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, company, role, status || 'applied', applied_date, notes]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update application
app.put('/applications/:id', auth, async (req, res) => {
  const { company, role, status, applied_date, notes } = req.body
  try {
    const result = await pool.query(
      'UPDATE applications SET company=$1, role=$2, status=$3, applied_date=$4, notes=$5 WHERE id=$6 AND user_id=$7 RETURNING *',
      [company, role, status, applied_date, notes, req.params.id, req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete application
app.delete('/applications/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM applications WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id])
    res.json({ message: 'Deleted!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
