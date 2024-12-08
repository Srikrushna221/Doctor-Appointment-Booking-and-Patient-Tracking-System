// src/actions/types.js

// Authentication
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOAD_USER = 'LOAD_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGOUT = 'LOGOUT';

export const SET_SUCCESS_MESSAGE = 'SET_SUCCESS_MESSAGE';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';

// Appointments
export const GET_APPOINTMENTS = 'GET_APPOINTMENTS';
export const BOOK_APPOINTMENT = 'BOOK_APPOINTMENT';
export const UPDATE_APPOINTMENT = 'UPDATE_APPOINTMENT';
export const APPOINTMENT_ERROR = 'APPOINTMENT_ERROR';
export const GET_AVAILABLE_TIME_SLOTS = 'GET_AVAILABLE_TIME_SLOTS';

export const GET_DOCTOR_CALENDAR = 'GET_DOCTOR_CALENDAR';



// Doctors
export const GET_DOCTORS = 'GET_DOCTORS';
export const GET_DOCTOR = 'GET_DOCTOR';
export const RATE_DOCTOR = 'RATE_DOCTOR';
export const DOCTOR_ERROR = 'DOCTOR_ERROR';

// Medical Records
export const GET_MEDICAL_HISTORY = 'GET_MEDICAL_HISTORY';
export const ADD_MEDICAL_RECORD = 'ADD_MEDICAL_RECORD';
export const MEDICAL_RECORD_ERROR = 'MEDICAL_RECORD_ERROR';

export const SAVE_RECORD = 'SAVE_RECORD';
export const FETCH_RECORDS = 'FETCH_RECORDS';
export const RECORD_ERROR = 'RECORD_ERROR';
