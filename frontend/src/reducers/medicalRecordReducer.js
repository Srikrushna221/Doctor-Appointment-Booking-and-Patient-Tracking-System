// src/reducers/medicalRecordReducer.js
import {
    GET_MEDICAL_HISTORY,
    ADD_MEDICAL_RECORD,
    MEDICAL_RECORD_ERROR,
  } from '../actions/types';
  
  const initialState = {
    medicalHistory: null,
    loading: true,
    error: {},
  };
  
  export default function medicalRecordReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_MEDICAL_HISTORY:
        return {
          ...state,
          medicalHistory: payload,
          loading: false,
        };
      case ADD_MEDICAL_RECORD:
        return {
          ...state,
          loading: false,
        };
      case MEDICAL_RECORD_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
        };
      default:
        return state;
    }
  }
  