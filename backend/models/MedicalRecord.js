const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  records: [
    {
      doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now },
      description: String,
      prescription: String,
    },
  ],
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
