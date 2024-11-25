// src/actions/medicalRecordActions.js
import axios from '../utils/api';
import {
  GET_MEDICAL_HISTORY,
  ADD_MEDICAL_RECORD,
  MEDICAL_RECORD_ERROR,
} from './types';

// Get Medical History
export const getMedicalHistory = (patientId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/medical-records/${patientId}`);
    dispatch({
      type: GET_MEDICAL_HISTORY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MEDICAL_RECORD_ERROR,
    });
  }
};

// Add Medical Record
export const addMedicalRecord = (recordData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/medical-records', recordData);
    dispatch({
      type: ADD_MEDICAL_RECORD,
      payload: res.data,
    });
    dispatch(getMedicalHistory(recordData.patientId));
  } catch (err) {
    dispatch({
      type: MEDICAL_RECORD_ERROR,
    });
  }
};
