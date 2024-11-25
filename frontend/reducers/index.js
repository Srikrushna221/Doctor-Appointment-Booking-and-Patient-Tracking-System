// src/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import appointmentReducer from './appointmentReducer';
import doctorReducer from './doctorReducer';
import medicalRecordReducer from './medicalRecordReducer';

export default combineReducers({
  auth: authReducer,
  appointments: appointmentReducer,
  doctors: doctorReducer,
  medicalRecords: medicalRecordReducer,
});
