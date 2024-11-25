const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Scheduled', 'Cancelled', 'Completed'],
    default: 'Scheduled',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
