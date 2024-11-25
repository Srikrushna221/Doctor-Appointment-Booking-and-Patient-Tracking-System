const Appointment = require('../models/Appointment');
const User = require('../models/User');

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

    // Create appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
    });

    await appointment.save();
    res.json({ msg: 'Appointment booked successfully', appointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Appointments
exports.getAppointments = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let appointments;

    if (userRole === 'Patient') {
      appointments = await Appointment.find({ patientId: userId }).populate('doctorId', 'name specialization');
    } else if (userRole === 'Doctor') {
      appointments = await Appointment.find({ doctorId: userId }).populate('patientId', 'name');
    } else {
      appointments = await Appointment.find().populate('patientId', 'name').populate('doctorId', 'name specialization');
    }

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Appointment (Cancel or Reschedule)
exports.updateAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const { date, status } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Authorization check
    if (
      (userRole === 'Patient' && appointment.patientId.toString() !== userId) ||
      (userRole === 'Doctor' && appointment.doctorId.toString() !== userId)
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (date) appointment.date = date;
    if (status) appointment.status = status;

    await appointment.save();
    res.json({ msg: 'Appointment updated', appointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
