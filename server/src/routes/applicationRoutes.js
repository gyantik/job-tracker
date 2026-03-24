const express = require('express')
const {
  getApplications,
  createApplication,
  updateApplication,
  patchApplication,
  deleteApplication,
} = require('../controllers/applicationController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').get(protect, getApplications).post(protect, createApplication)
router.route('/:id').put(protect, updateApplication).patch(protect, patchApplication).delete(protect, deleteApplication)

module.exports = router
