const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/db')

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }

  const normalizedEmail = String(email).trim().toLowerCase()

  try {
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail])
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email is already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [String(name).trim(), normalizedEmail, hashedPassword]
    )

    const user = createdUser.rows[0]

    return res.status(201).json({
      message: 'User created',
      token: createToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const normalizedEmail = String(email).trim().toLowerCase()

  try {
    const foundUser = await pool.query('SELECT id, name, email, password FROM users WHERE email = $1', [normalizedEmail])
    if (foundUser.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = foundUser.rows[0]

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    return res.json({
      message: 'Logged in',
      token: createToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = { register, login }
