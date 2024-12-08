// src/actions/appointmentActions.js
import axios from '../utils/api';
import {
  GET_APPOINTMENTS,
  BOOK_APPOINTMENT,
  UPDATE_APPOINTMENT,
  APPOINTMENT_ERROR,
  GET_DOCTOR_CALENDAR,
  GET_AVAILABLE_TIME_SLOTS
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
      payload: err.response.data,
    });
  }
};

// Cancel Appointment
export const cancelAppointment = (appointmentId) => async (dispatch) => {
  try {
    await axios.put(`/api/appointments/${appointmentId}/cancel`);
    dispatch(getAppointments()); // Refresh the appointments list
  } catch (err) {
    dispatch({
      type: APPOINTMENT_ERROR,
      payload: err.response?.data || { msg: 'An error occurred' },
    });
  }
};

// Get Available Time Slots
export const getAvailableTimeSlots = (doctorId, date) => async (dispatch) => {
  try {
    const res = await axios.get('/api/appointments/available', {
      params: { doctorId, date },
    });
    console.log('API Response:', res.data); // Log the API response
    dispatch({
      type: GET_AVAILABLE_TIME_SLOTS,
      payload: res.data.timeSlots || [],
    });
  } catch (err) {
    console.error('API Error:', err.response?.data || err.message); // Log the error
    dispatch({
      type: APPOINTMENT_ERROR,
      payload: err.response?.data || { msg: 'An error occurred' },
    });
  }
};



export const getDoctorCalendar = (doctorId, date) => async (dispatch) => {
  try {
    const res = await axios.get('/api/appointments/calendar', {
      params: { doctorId, date },
    });
    dispatch({
      type: GET_DOCTOR_CALENDAR,
      payload: res.data.timeSlots,
    });
  } catch (err) {
    console.error('Error fetching doctor calendar:', err.response?.data || err.message);
    dispatch({
      type: APPOINTMENT_ERROR,
      payload: err.response?.data || { msg: 'Failed to fetch calendar data' },
    });
  }
};
