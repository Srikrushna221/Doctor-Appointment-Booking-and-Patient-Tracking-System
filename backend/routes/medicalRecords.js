const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
// const {
//   addOrUpdateMedicalRecord,
//   getMedicalHistory,
// } = require('../controllers/medicalRecordController');

const { saveMedicalRecord, getMedicalRecords } = require('../controllers/medicalRecordController');

// @route   POST api/medical-records
// @desc    Add or update medical record
// @access  Private (Doctor)
// router.post('/', authenticateToken, addOrUpdateMedicalRecord);

// // @route   GET api/medical-records/:patientId
// // @desc    Get patient medical history
// // @access  Private (Patient or Doctor)
// router.get('/:patientId', authenticateToken, getMedicalHistory);

router.post('/', saveMedicalRecord);

// Fetch Medical Records for a Patient
router.get('/:patientId', getMedicalRecords);

module.exports = router;
