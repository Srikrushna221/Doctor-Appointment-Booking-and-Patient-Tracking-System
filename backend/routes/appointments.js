const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  bookAppointment,
  getAppointments,
  updateAppointment,
} = require('../controllers/appointmentController');

// @route   POST api/appointments/book
// @desc    Book an appointment
// @access  Private (Patient)
router.post('/book', authenticateToken, bookAppointment);

// @route   GET api/appointments
// @desc    Get appointments
// @access  Private
router.get('/', authenticateToken, getAppointments);

// @route   PUT api/appointments/:id
// @desc    Update appointment (Cancel or Reschedule)
// @access  Private
router.put('/:id', authenticateToken, updateAppointment);

module.exports = router;
