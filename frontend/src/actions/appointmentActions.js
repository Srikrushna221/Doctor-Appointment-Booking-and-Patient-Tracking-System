// src/actions/appointmentActions.js
import axios from '../utils/api';
import {
  GET_APPOINTMENTS,
  BOOK_APPOINTMENT,
  UPDATE_APPOINTMENT,
  APPOINTMENT_ERROR,
} from './types';

// Get Appointments
export const getAppointments = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/appointments');
    dispatch({
      type: GET_APPOINTMENTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: APPOINTMENT_ERROR,
    });
  }
};

// Book Appointment
export const bookAppointment = (appointmentData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/appointments/book', appointmentData);
    dispatch({
      type: BOOK_APPOINTMENT,
      payload: res.data,
    });
    dispatch(getAppointments());
  } catch (err) {
    dispatch({
      type: APPOINTMENT_ERROR,
    });
  }
};

// Update Appointment
export const updateAppointment = (id, updateData) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/appointments/${id}`, updateData);
    dispatch({
      type: UPDATE_APPOINTMENT,
      payload: res.data,
    });
    dispatch(getAppointments());
  } catch (err) {
    dispatch({
      type: APPOINTMENT_ERROR,
    });
  }
};
