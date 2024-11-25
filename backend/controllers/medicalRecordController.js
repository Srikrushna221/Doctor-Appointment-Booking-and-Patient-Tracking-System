const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');

// Add or Update Medical Record
exports.addOrUpdateMedicalRecord = async (req, res) => {
  const { patientId, description, prescription } = req.body;
  const doctorId = req.user.id;

  try {
    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'Patient') {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    let medicalRecord = await MedicalRecord.findOne({ patientId });

    if (!medicalRecord) {
      medicalRecord = new MedicalRecord({ patientId, records: [] });
    }

    medicalRecord.records.push({
      doctorId,
      description,
      prescription,
    });

    await medicalRecord.save();
    res.json({ msg: 'Medical record updated', medicalRecord });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Patient Medical History
exports.getMedicalHistory = async (req, res) => {
  const patientId = req.params.patientId;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Authorization check
    if (userRole === 'Patient' && userId !== patientId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const medicalRecord = await MedicalRecord.findOne({ patientId })
      .populate('records.doctorId', 'name specialization');

    if (!medicalRecord) {
      return res.status(404).json({ msg: 'Medical records not found' });
    }

    res.json(medicalRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
