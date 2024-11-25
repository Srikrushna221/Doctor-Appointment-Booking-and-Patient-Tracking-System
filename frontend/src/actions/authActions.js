// src/actions/authActions.js
import axios from '../utils/api';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOAD_USER,
  AUTH_ERROR,
  LOGOUT,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth/user');
    dispatch({
      type: LOAD_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const registerUser = (formData, navigate) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth/register', formData);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    navigate('/'); // Redirect after registration
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const loginUser = (credentials, navigate) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth/login', credentials);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    navigate('/'); // Redirect after login
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
