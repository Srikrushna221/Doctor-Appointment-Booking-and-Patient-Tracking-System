// models/MedicalRecord.js
const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to Patient
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to Doctor
      required: true,
    },
    record: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);

