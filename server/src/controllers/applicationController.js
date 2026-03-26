const { initDB, pool } = require('../config/db')

const selectProjection = `
  SELECT
    a.id AS "_id",
    a.user_id AS "userId",
    a.company,
    a.role,
    a.status,
    a.applied_date AS "appliedDate",
    a.notes,
    a.created_at AS "createdAt",
    a.updated_at AS "updatedAt"
`

const getApplications = async (req, res) => {
  try {
    await initDB()

    const applications = await pool.query(
      `${selectProjection} FROM applications a WHERE a.user_id = $1 ORDER BY a.created_at DESC`,
      [req.user.id]
    )
    return res.json(applications.rows)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const createApplication = async (req, res) => {
  const { company, role, status, appliedDate, notes } = req.body

  if (!company || !role || !appliedDate) {
    return res.status(400).json({ error: 'Company, role, and appliedDate are required' })
  }

  try {
    await initDB()

    const application = await pool.query(
      `WITH created AS (
         INSERT INTO applications (user_id, company, role, status, applied_date, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id
       )
       ${selectProjection}
       FROM applications a
       INNER JOIN created c ON a.id = c.id`,
      [req.user.id, company, role, status || 'applied', appliedDate, notes || '']
    )

    return res.status(201).json(application.rows[0])
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const updateApplication = async (req, res) => {
  const { id } = req.params
  const { company, role, status, appliedDate, notes } = req.body

  try {
    await initDB()

    const updated = await pool.query(
      `UPDATE applications
       SET company = $1,
           role = $2,
           status = $3,
           applied_date = $4,
           notes = $5,
           updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING
         id AS "_id",
         user_id AS "userId",
         company,
         role,
         status,
         applied_date AS "appliedDate",
         notes,
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [company, role, status, appliedDate, notes || '', id, req.user.id]
    )

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' })
    }

    return res.json(updated.rows[0])
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const patchApplication = async (req, res) => {
  const { id } = req.params
  const { company, role, status, appliedDate, notes } = req.body

  try {
    await initDB()

    const updated = await pool.query(
      `UPDATE applications
       SET company = COALESCE($1, company),
           role = COALESCE($2, role),
           status = COALESCE($3, status),
           applied_date = COALESCE($4, applied_date),
           notes = COALESCE($5, notes),
           updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING
         id AS "_id",
         user_id AS "userId",
         company,
         role,
         status,
         applied_date AS "appliedDate",
         notes,
         created_at AS "createdAt",
         updated_at AS "updatedAt"`,
      [company, role, status, appliedDate, notes, id, req.user.id]
    )

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' })
    }

    return res.json(updated.rows[0])
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const deleteApplication = async (req, res) => {
  const { id } = req.params

  try {
    await initDB()

    const deleted = await pool.query('DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id', [
      id,
      req.user.id,
    ])

    if (deleted.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' })
    }

    return res.json({ message: 'Application deleted' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getApplications,
  createApplication,
  updateApplication,
  patchApplication,
  deleteApplication,
}
