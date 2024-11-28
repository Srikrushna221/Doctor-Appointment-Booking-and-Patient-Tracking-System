// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const APPOINTMENT_DURATION = 30; // in minutes

// Book Appointment
exports.bookAppointment = async (req, res) => {
  const { doctorId, date } = req.body;
  const patientId = req.user.id;

  try {
    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Parse the requested date
    const requestedDate = new Date(date);
    const currentDate = new Date();

    // Validate that the requested date is in the future
    if (requestedDate <= currentDate) {
      return res.status(400).json({ msg: 'Cannot book an appointment in the past' });
    }

    // Calculate appointment end time
    const appointmentEnd = new Date(requestedDate.getTime() + APPOINTMENT_DURATION * 60000);

    // Conflict checking for doctor
    const doctorConflict = await Appointment.findOne({
      doctorId: doctorId,
      status: 'Scheduled',
      $or: [
        {
          date: { $lt: appointmentEnd, $gte: requestedDate },
        },
        {
          date: { $lte: requestedDate },
          endDate: { $gt: requestedDate },
        },
      ],
    });

    if (doctorConflict) {
      return res.status(400).json({ msg: 'Doctor is not available at this time' });
    }

    // Conflict checking for patient
    const patientConflict = await Appointment.findOne({
      patientId: patientId,
      status: 'Scheduled',
      $or: [
        {
          date: { $lt: appointmentEnd, $gte: requestedDate },
        },
        {
          date: { $lte: requestedDate },
          endDate: { $gt: requestedDate },
        },
      ],
    });

    if (patientConflict) {
      return res.status(400).json({ msg: 'You have another appointment at this time' });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      date: requestedDate,
      endDate: appointmentEnd,
    });

    await appointment.save();
    res.json({ msg: 'Appointment booked successfully', appointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.cancelAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Check if the user is authorized to cancel (patient or doctor)
    if (
      appointment.patientId.toString() !== userId &&
      appointment.doctorId.toString() !== userId
    ) {
      return res.status(401).json({ msg: 'Not authorized to cancel this appointment' });
    }

    // Cancel the appointment
    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({ msg: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Available Time Slots
exports.getAvailableTimeSlots = async (req, res) => {
  const { doctorId, date } = req.query;

  try {
    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Get all appointments for the doctor on the specified date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctorId: doctorId,
      status: 'Scheduled',
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Generate all possible time slots for the day
    const timeSlots = [];
    const openingHour = 9; // Doctor's opening hour
    const closingHour = 17; // Doctor's closing hour

    for (let hour = openingHour; hour < closingHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += APPOINTMENT_DURATION) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minutes, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + APPOINTMENT_DURATION * 60000);

        // Check if the slot overlaps with any existing appointment
        const isUnavailable = appointments.some((appointment) => {
          return (
            (appointment.date < slotEnd && appointment.date >= slotStart) ||
            (appointment.date <= slotStart && appointment.endDate > slotStart)
          );
        });

        timeSlots.push({
          start: slotStart,
          end: slotEnd,
          isAvailable: !isUnavailable,
        });
      }
    }

    res.json({ timeSlots });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let appointments;

    if (userRole === 'Doctor') {
      // Fetch appointments for the doctor
      appointments = await Appointment.find({ doctorId: userId, status: 'Scheduled' }).populate('patientId', 'name email');
    } else if (userRole === 'Patient') {
      // Fetch appointments for the patient
      appointments = await Appointment.find({ patientId: userId, status: 'Scheduled' }).populate('doctorId', 'name specialization');
    } else {
      return res.status(403).json({ msg: 'Unauthorized access' });
    }

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getDoctorCalendar = async (req, res) => {
  const { doctorId, date } = req.query;

  try {
    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Get all appointments for the doctor on the specified date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctorId,
      status: 'Scheduled',
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Generate all possible time slots for the day
    const timeSlots = [];
    const openingHour = 9; // Doctor's opening hour
    const closingHour = 17; // Doctor's closing hour

    for (let hour = openingHour; hour < closingHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += APPOINTMENT_DURATION) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minutes, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + APPOINTMENT_DURATION * 60000);

        // Check if the slot overlaps with any existing appointment
        const isBooked = appointments.some((appointment) => {
          return (
            (appointment.date < slotEnd && appointment.date >= slotStart) ||
            (appointment.date <= slotStart && appointment.endDate > slotStart)
          );
        });

        timeSlots.push({
          start: slotStart,
          end: slotEnd,
          isBooked,
        });
      }
    }

    res.json({ timeSlots });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
