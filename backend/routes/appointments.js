const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  getAvailableTimeSlots,
  getDoctorCalendar,
} = require('../controllers/appointmentController');

// @route   POST api/appointments/book
// @desc    Book an appointment
// @access  Private (Patient)
router.post('/book', authenticateToken, bookAppointment);

// @route   GET api/appointments
// @desc    Get appointments
// @access  Private
router.get('/', authenticateToken, getAppointments);

// @route   PUT api/appointments/:id/cancel
// @desc    Cancel an appointment
// @access  Private
router.put('/:id/cancel', authenticateToken, cancelAppointment);

// @route   GET api/appointments/available
// @desc    Get available time slots for a doctor
// @access  Private
router.get('/available', authenticateToken, getAvailableTimeSlots);


router.get('/calendar', authenticateToken, getDoctorCalendar);

module.exports = router;
