const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllDoctors,
  getDoctorProfile,
  rateDoctor,
} = require('../controllers/doctorController');

// @route   GET api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', getAllDoctors);

// @route   GET api/doctors/:id
// @desc    Get doctor profile
// @access  Public
router.get('/:id', getDoctorProfile);

// @route   POST api/doctors/:id/rate
// @desc    Rate a doctor
// @access  Private (Patient)
router.post('/:id/rate', authenticateToken, rateDoctor);

module.exports = router;
