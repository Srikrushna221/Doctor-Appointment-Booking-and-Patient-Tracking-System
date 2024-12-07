// src/actions/doctorActions.js
import axios from '../utils/api';
import {
  GET_DOCTORS,
  GET_DOCTOR,
  RATE_DOCTOR,
  DOCTOR_ERROR,
} from './types';

// Get All Doctors
export const getDoctors = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/doctors');
    dispatch({
      type: GET_DOCTORS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: DOCTOR_ERROR,
    });
  }
};

// Get Doctor Profile
export const getDoctor = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/doctors/${id}`);
    dispatch({
      type: GET_DOCTOR,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: DOCTOR_ERROR,
    });
  }
};

// Rate Doctor
export const rateDoctor = (id, rating) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/doctors/${id}/rate`, { rating });
    dispatch({
      type: RATE_DOCTOR,
      payload: res.data,
    });
    dispatch(getDoctor(id));
  } catch (err) {
    dispatch({
      type: DOCTOR_ERROR,
    });
  }
};

// Fetch all doctors
export const fetchDoctors = () => async (dispatch) => {
  try {
    const res = await api.get('/api/doctors');
    dispatch({
      type: GET_DOCTORS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: DOCTOR_ERROR,
      payload: err.response?.data || { msg: 'Error fetching doctors' },
    });
  }
};
