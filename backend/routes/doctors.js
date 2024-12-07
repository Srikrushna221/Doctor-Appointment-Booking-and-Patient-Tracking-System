const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllDoctors,
  getDoctorProfile,
  rateDoctor,
  addOrUpdateDoctorDescription, // New controller for updating the doctor's description
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

// @route   PUT api/doctors/:id/description
// @desc    Add or update doctor's description
// @access  Private (Doctor)
router.put('/:id/description', authenticateToken, addOrUpdateDoctorDescription);

module.exports = router;
