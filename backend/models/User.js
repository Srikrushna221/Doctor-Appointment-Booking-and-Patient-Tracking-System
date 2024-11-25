const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['Patient', 'Doctor', 'Admin'],
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Additional fields for doctors
  specialization: String,
  ratings: [
    {
      patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
