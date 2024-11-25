// src/reducers/doctorReducer.js
import {
    GET_DOCTORS,
    GET_DOCTOR,
    RATE_DOCTOR,
    DOCTOR_ERROR,
  } from '../actions/types';
  
  const initialState = {
    doctors: [],
    doctor: null,
    loading: true,
    error: {},
  };
  
  export default function doctorReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_DOCTORS:
        return {
          ...state,
          doctors: payload,
          loading: false,
        };
      case GET_DOCTOR:
      case RATE_DOCTOR:
        return {
          ...state,
          doctor: payload,
          loading: false,
        };
      case DOCTOR_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
        };
      default:
        return state;
    }
  }
  