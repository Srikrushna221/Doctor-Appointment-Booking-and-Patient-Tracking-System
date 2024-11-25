const User = require('../models/User');

// Get All Doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'Doctor' }).select('-password');
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Doctor Profile
exports.getDoctorProfile = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const doctor = await User.findById(doctorId).select('-password');
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Rate Doctor
exports.rateDoctor = async (req, res) => {
  const doctorId = req.params.id;
  const patientId = req.user.id;
  const { rating } = req.body;

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Check if patient has already rated
    const existingRating = doctor.ratings.find(
      (r) => r.patientId.toString() === patientId
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      doctor.ratings.push({ patientId, rating });
    }

    await doctor.save();
    res.json({ msg: 'Doctor rated successfully', doctor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
