// src/reducers/appointmentReducer.js
import {
    GET_APPOINTMENTS,
    BOOK_APPOINTMENT,
    UPDATE_APPOINTMENT,
    APPOINTMENT_ERROR,
  } from '../actions/types';
  
  const initialState = {
    appointments: [],
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
  