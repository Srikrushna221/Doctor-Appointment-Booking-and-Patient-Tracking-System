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
    if (requestedDate < currentDate) {
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
    if (!doctorId || !date) {
      return res.status(400).json({ msg: 'Doctor ID and date are required' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    const timeSlots = [];
    const openingHour = 9; // Start at 9:00 AM
    const closingHour = 18; // End at 6:00 PM

    for (let hour = openingHour; hour < closingHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minutes, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

        timeSlots.push({
          start: slotStart,
          end: slotEnd,
          isAvailable: true, // Default availability
        });
      }
    }

    // Fetch existing appointments for the date
    const appointments = await Appointment.find({
      doctorId,
      status: { $ne: 'Canceled' }, // Exclude canceled appointments
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999),
      },
    });

    // Update time slots with availability based on appointments
    const updatedTimeSlots = timeSlots.map((slot) => ({
      ...slot,
      isAvailable: !appointments.some(
        (appointment) =>
          appointment.date < slot.end && appointment.endDate > slot.start
      ),
    }));

    res.json({ timeSlots: updatedTimeSlots });
  } catch (err) {
    console.error('Error fetching time slots:', err.message);
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
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Ensure date is valid and a weekday
    const requestedDate = new Date(date);
    const day = requestedDate.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    if (day === 0 || day === 6) {
      return res.status(400).json({ msg: 'Appointments can only be booked on weekdays (Monday to Friday)' });
    }

    // Generate time slots for the day
    const timeSlots = [];
    const openingHour = 9; // 9:00 AM
    const closingHour = 18; // 6:00 PM

    for (let hour = openingHour; hour < closingHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minutes, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

        timeSlots.push({
          start: slotStart,
          end: slotEnd,
        });
      }
    }

    // Fetch existing appointments for the doctor on the date
    const appointments = await Appointment.find({
      doctorId,
      status: 'Scheduled',
      date: { $gte: new Date(date).setHours(0, 0, 0, 0), $lte: new Date(date).setHours(23, 59, 59, 999) },
    });

    // Mark slots as booked or available
    const slotsWithAvailability = timeSlots.map((slot) => ({
      start: slot.start,
      end: slot.end,
      isBooked: appointments.some((appointment) => {
        return (
          (appointment.date < slot.end && appointment.date >= slot.start) ||
          (appointment.date <= slot.start && appointment.endDate > slot.start)
        );
      }),
    }));

    res.json({ timeSlots: slotsWithAvailability });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

