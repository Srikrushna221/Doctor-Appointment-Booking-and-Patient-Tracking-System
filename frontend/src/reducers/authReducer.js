// reducers/authReducer.js

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOAD_USER,
  AUTH_ERROR,
  LOGOUT,
  SET_SUCCESS_MESSAGE,
  SET_ERROR_MESSAGE,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  successMessage: '',
  errorMessage: '',
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_USER:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        successMessage: null, // Clear any previous success message
        errorMessage: null,  // Clear any error message
        loading: false,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        errorMessage: payload, // Set the error message
      };
    case SET_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: payload, // Set success message
      };
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: payload, // Set error message
      };
    default:
      return state;
  }
}
