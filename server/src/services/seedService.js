const bcrypt = require('bcryptjs')
const { pool } = require('../config/db')

const seedDemoData = async () => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const demoEmail = 'demo@jobtracker.com'
    const demoName = 'Demo User'
    const demoPasswordPlain = 'password123'
    const demoPasswordHash = await bcrypt.hash(demoPasswordPlain, 10)

    const userResult = await client.query(
      `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        ON CONFLICT (email)
        DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password
        RETURNING id
      `,
      [demoName, demoEmail, demoPasswordHash]
    )

    const userId = userResult.rows[0].id

    await client.query('DELETE FROM applications WHERE user_id = $1', [userId])

    await client.query(
      `
        INSERT INTO applications (user_id, company, role, status, applied_date, notes)
        VALUES
          ($1, 'Microsoft', 'Frontend Developer', 'interview', CURRENT_DATE - INTERVAL '12 days', 'First technical round completed'),
          ($1, 'Google', 'Software Engineer', 'applied', CURRENT_DATE - INTERVAL '6 days', 'Waiting for recruiter response'),
          ($1, 'Amazon', 'Full Stack Engineer', 'offer', CURRENT_DATE - INTERVAL '20 days', 'Offer received, evaluating package')
      `,
      [userId]
    )

    await client.query('COMMIT')

    return {
      demoEmail,
      demoPassword: demoPasswordPlain,
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = { seedDemoData }
