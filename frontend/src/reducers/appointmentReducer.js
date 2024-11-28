// src/reducers/appointmentReducer.js
import {
    GET_APPOINTMENTS,
    BOOK_APPOINTMENT,
    UPDATE_APPOINTMENT,
    APPOINTMENT_ERROR,
    GET_AVAILABLE_TIME_SLOTS,
    GET_DOCTOR_CALENDAR,
  } from '../actions/types';
  
  const initialState = {
    appointments: [],
    availableTimeSlots: [],
    loading: true,
    error: {},
  };
  
  export default function appointmentReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_APPOINTMENTS:
        return {
          ...state,
          appointments: payload,
          loading: false,
        };
      case BOOK_APPOINTMENT:
      case UPDATE_APPOINTMENT:
        return {
          ...state,
          loading: false,
        };
      case GET_AVAILABLE_TIME_SLOTS:
          return {
            ...state,
            availableTimeSlots: payload || [], // Default to an empty array
            loading: false,
          };
      case GET_DOCTOR_CALENDAR:
          return {
            ...state,
            timeSlots: payload || [],
            loading: false,
          };
      case APPOINTMENT_ERROR:
          return {
            ...state,
            error: payload,
            loading: false,
          };
      default:
        return state;
    }
  }
  