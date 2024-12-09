const express = require('express');
const cors = require('cors');
const { dbConnect } = require('./config/db');
const dotenv = require('dotenv');
const medicalRecordsRoute = require('./routes/medicalRecords');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
dbConnect();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
// app.use('/api/medical-records', require('./routes/medicalRecords'));
app.use('/api/medicalRecords', medicalRecordsRoute);
app.use('/api/doctors', require('./routes/doctors'));

// Start Server
const PORT = 4040;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));