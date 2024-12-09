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

exports.addOrUpdateDoctorDescription = async (req, res) => {
  const doctorId = req.params.id;
  const { description } = req.body;

  try {
    if (req.user.role !== 'Doctor' || req.user.id !== doctorId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    doctor.description = description || '';
    await doctor.save();

    res.json({ msg: 'Description updated successfully', doctor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addDoctorRating = async (req, res) => {
  const { rating } = req.body;
  const patientId = req.user.id;
  const doctorId = req.params.id;

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Check if the patient has already rated the doctor
    const existingRating = doctor.ratings.find(
      (r) => r.patientId.toString() === patientId
    );

    if (existingRating) {
      existingRating.rating = rating; // Update the existing rating
    } else {
      doctor.ratings.push({ patientId, rating }); // Add a new rating
    }

    // Save changes
    await doctor.save();

    // Recalculate average rating and total reviews
    const totalRatings = doctor.ratings.length; // This count remains constant even when a rating is updated
    const averageRating =
      totalRatings > 0
        ? doctor.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    res.json({
      msg: 'Rating added successfully',
      totalRatings,
      averageRating,
    });
  } catch (err) {
    console.error('Error in addDoctorRating:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getDoctorRating = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    const totalRatings = doctor.ratings.length;
    const averageRating =
      totalRatings > 0
        ? doctor.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    res.json({ averageRating, totalRatings });
  } catch (err) {
    console.error('Error in getDoctorRating:', err.message);
    res.status(500).send('Server Error');
  }
};



