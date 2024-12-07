// // src/actions/medicalRecordActions.js
// import axios from '../utils/api';
// import {
//   GET_MEDICAL_HISTORY,
//   ADD_MEDICAL_RECORD,
//   MEDICAL_RECORD_ERROR,
// } from './types';

// // Get Medical History
// export const getMedicalHistory = (patientId) => async (dispatch) => {
//   try {
//     const res = await axios.get(`/api/medical-records/${patientId}`);
//     dispatch({
//       type: GET_MEDICAL_HISTORY,
//       payload: res.data,
//     });
//   } catch (err) {
//     dispatch({
//       type: MEDICAL_RECORD_ERROR,
//     });
//   }
// };

// // Add Medical Record
// export const addMedicalRecord = (recordData) => async (dispatch) => {
//   try {
//     const res = await axios.post('/api/medical-records', recordData);
//     dispatch({
//       type: ADD_MEDICAL_RECORD,
//       payload: res.data,
//     });
//     dispatch(getMedicalHistory(recordData.patientId));
//   } catch (err) {
//     dispatch({
//       type: MEDICAL_RECORD_ERROR,
//     });
//   }
// };


import axios from 'axios';
import { SAVE_RECORD, FETCH_RECORDS, RECORD_ERROR } from './types';



// Save or Update Medical Record
export const saveMedicalRecord = (data) => async (dispatch, getState) => {
  try {
    const { auth } = getState(); // Get the logged-in user's details
    const doctorId = auth.user._id; // Extract the doctor's ID

    if (!data.patientId || !doctorId || !data.record) {
      throw new Error('Required fields are missing');
    }

    const res = await axios.post('/api/medicalRecords', {
      ...data,
      doctorId,
    });
    dispatch({
      type: SAVE_RECORD,
      payload: res.data.medicalRecord,
    });
  } catch (err) {
    dispatch({
      type: RECORD_ERROR,
      payload: err.response?.data || { msg: 'Error saving record' },
    });
  }
};


// Fetch Medical Records for a Patient
export const fetchMedicalRecords = () => async (dispatch, getState) => {
  try {
    const { auth } = getState(); // Get the logged-in user's details
    const patientId = auth.user._id; // Extract the patient's ID

    if (!patientId) {
      throw new Error('Patient ID is undefined');
    }

    const res = await axios.get(`/api/medicalRecords/${patientId}`);
    dispatch({
      type: FETCH_RECORDS,
      payload: res.data.records,
    });
  } catch (err) {
    dispatch({
      type: RECORD_ERROR,
      payload: err.response?.data || { msg: 'Error fetching records' },
    });
  }
};

