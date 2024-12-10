import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
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
} from '../actions/types';
import { loadUser, registerUser, loginUser, logout } from '../actions/authActions';
import setAuthToken from '../utils/setAuthToken';

jest.mock('../utils/setAuthToken');

const mockStore = configureMockStore([thunk]);
const mockAxios = new MockAdapter(axios);

describe('Auth Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    mockAxios.reset();
    jest.clearAllMocks();
  });

  describe('loadUser', () => {
    it('should dispatch LOAD_USER on success', async () => {
      const mockUser = { id: 1, name: 'John Doe' };
      mockAxios.onGet('/api/auth/user').reply(200, mockUser);

      await store.dispatch(loadUser());

      const actions = store.getActions();
      expect(setAuthToken).toHaveBeenCalledWith(localStorage.token);
      expect(actions[0]).toEqual({ type: LOAD_USER, payload: mockUser });
    });

    it('should dispatch AUTH_ERROR on failure', async () => {
      mockAxios.onGet('/api/auth/user').reply(500);

      await store.dispatch(loadUser());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: AUTH_ERROR });
    });
  });

  describe('registerUser', () => {
    it('should dispatch REGISTER_SUCCESS and SET_SUCCESS_MESSAGE on successful registration', async () => {
      const mockData = { token: 'abc123' };
      mockAxios.onPost('/api/auth/register').reply(200, mockData);

      const formData = { name: 'John', email: 'john@example.com', password: 'password' };
      await store.dispatch(registerUser(formData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: REGISTER_SUCCESS, payload: mockData });
      expect(actions[1]).toEqual({
        type: SET_SUCCESS_MESSAGE,
        payload: 'Registration successful! Please log in.',
      });
    });

    it('should dispatch REGISTER_FAIL and SET_ERROR_MESSAGE on failure', async () => {
      const errorResponse = { msg: 'Email already in use' };
      mockAxios.onPost('/api/auth/register').reply(400, errorResponse);

      const formData = { name: 'John', email: 'john@example.com', password: 'password' };
      await store.dispatch(registerUser(formData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: REGISTER_FAIL,
        payload: errorResponse.msg,
      });
      expect(actions[1]).toEqual({
        type: SET_ERROR_MESSAGE,
        payload: errorResponse.msg,
      });
    });
  });

  describe('loginUser', () => {
    it('should dispatch LOGIN_SUCCESS, loadUser, and navigate based on user role on success', async () => {
      const mockData = {
        token: 'abc123',
        user: { role: 'Patient', name: 'John' },
      };
      const navigate = jest.fn();
      mockAxios.onPost('/api/auth/login').reply(200, mockData);

      const credentials = { email: 'john@example.com', password: 'password' };
      await store.dispatch(loginUser(credentials, navigate));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: LOGIN_SUCCESS, payload: mockData });
      expect(setAuthToken).toHaveBeenCalledWith('abc123');
      expect(navigate).toHaveBeenCalledWith('/patient/dashboard');
    });

    it('should dispatch LOGIN_FAIL and throw an error on failure', async () => {
      const errorResponse = { msg: 'Invalid credentials' };
      const navigate = jest.fn();
      mockAxios.onPost('/api/auth/login').reply(401, errorResponse);

      const credentials = { email: 'john@example.com', password: 'wrongpassword' };

      await expect(store.dispatch(loginUser(credentials, navigate))).rejects.toThrow(
        new Error(errorResponse.msg)
      );

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: LOGIN_FAIL });
    });
  });

  describe('logout', () => {
    it('should dispatch LOGOUT and clear token from localStorage', () => {
      localStorage.setItem('token', 'abc123');
      store.dispatch(logout());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: LOGOUT });
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
