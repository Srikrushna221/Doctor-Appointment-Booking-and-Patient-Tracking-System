const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllDoctors,
  getDoctorProfile,
  addDoctorRating, 
  getDoctorRating, 
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

// @route   PUT api/doctors/:id/description
// @desc    Add or update doctor's description
// @access  Private (Doctor)
router.put('/:id/description', authenticateToken, addOrUpdateDoctorDescription);

// Add a rating for a doctor
router.post('/:id/rate', authenticateToken, addDoctorRating);

// Get the average rating for a doctor
router.get('/:id/rating', getDoctorRating);

module.exports = router;
