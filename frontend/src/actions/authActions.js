import axios from '../utils/api';
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

    // Dispatch success message to the Redux store
    dispatch({
      type: SET_SUCCESS_MESSAGE,
      payload: 'Registration successful! Please log in.',
    });

  } catch (err) {
    const errorMsg = err.response && err.response.data
      ? err.response.data.msg || 'An error occurred. Please try again.'
      : 'An error occurred. Please try again.';

    dispatch({
      type: REGISTER_FAIL,
      payload: errorMsg,
    });

    // Dispatch error message to Redux store
    dispatch({
      type: SET_ERROR_MESSAGE,
      payload: errorMsg,
    });
  }
};


// Login User
export const loginUser = (credentials, navigate) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth/login', credentials);

    // Dispatch LOGIN_SUCCESS action
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    // Store the token in localStorage
    const { token, user } = res.data;
    localStorage.setItem('token', token);

    // Dispatch loadUser to update state with user data
    dispatch(loadUser());

    // Redirect based on user role
    const { role } = user;
    if (role === 'Patient') {
      navigate('/patient/dashboard');
    } else if (role === 'Doctor') {
      navigate('/doctor/dashboard');
    } else {
      navigate('/'); // Fallback if role is not defined
    }
  } catch (err) {
    let errorMsg = 'An error occurred. Please try again.';
    if (err.response && err.response.data) {
      errorMsg = err.response.data.msg || errorMsg; // Use msg from API response if available
    }

    // Dispatch LOGIN_FAIL action
    dispatch({
      type: LOGIN_FAIL,
    });

    // Optional: Return error message to the component
    throw new Error(errorMsg);
  }
};


// Logout
export const logout = () => (dispatch) => {
  // Clear token from localStorage
  localStorage.removeItem('token');
  dispatch({ type: LOGOUT });
};
