import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import axios from '../utils/api';
import {
  GET_DOCTORS,
  GET_DOCTOR,
  RATE_DOCTOR,
  DOCTOR_ERROR,
} from '../actions/types';
import { getDoctors, getDoctor, rateDoctor, fetchDoctors } from '../actions/doctorActions';

const mockStore = configureMockStore([thunk]);
const mockAxios = new MockAdapter(axios);

describe('Doctor Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    mockAxios.reset();
  });

  describe('getDoctors', () => {
    it('should dispatch GET_DOCTORS on success', async () => {
      const mockData = [{ id: '1', name: 'Dr. Smith' }];
      mockAxios.onGet('/api/doctors').reply(200, mockData);

      await store.dispatch(getDoctors());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: GET_DOCTORS, payload: mockData });
    });

    it('should dispatch DOCTOR_ERROR on failure', async () => {
      mockAxios.onGet('/api/doctors').reply(500);

      await store.dispatch(getDoctors());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: DOCTOR_ERROR });
    });
  });

  describe('getDoctor', () => {
    it('should dispatch GET_DOCTOR on success', async () => {
      const mockData = { id: '1', name: 'Dr. Smith', specialization: 'Cardiology' };
      mockAxios.onGet('/api/doctors/1').reply(200, mockData);

      await store.dispatch(getDoctor('1'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: GET_DOCTOR, payload: mockData });
    });

    it('should dispatch DOCTOR_ERROR on failure', async () => {
      mockAxios.onGet('/api/doctors/1').reply(404);

      await store.dispatch(getDoctor('1'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: DOCTOR_ERROR });
    });
  });

  describe('rateDoctor', () => {
    it('should dispatch RATE_DOCTOR and refresh doctor data on success', async () => {
      const mockRateResponse = { id: '1', rating: 5 };
      const mockDoctorResponse = { id: '1', name: 'Dr. Smith', averageRating: 4.5 };
      mockAxios.onPost('/api/doctors/1/rate').reply(200, mockRateResponse);
      mockAxios.onGet('/api/doctors/1').reply(200, mockDoctorResponse);

      await store.dispatch(rateDoctor('1', 5));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: RATE_DOCTOR, payload: mockRateResponse });
      expect(actions[1]).toEqual({ type: GET_DOCTOR, payload: mockDoctorResponse });
    });

    it('should dispatch DOCTOR_ERROR on failure', async () => {
      mockAxios.onPost('/api/doctors/1/rate').reply(500);

      await store.dispatch(rateDoctor('1', 5));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: DOCTOR_ERROR });
    });
  });

  describe('fetchDoctors', () => {
    it('should dispatch GET_DOCTORS on success', async () => {
      const mockData = [{ id: '1', name: 'Dr. Smith' }];
      mockAxios.onGet('/api/doctors').reply(200, mockData);

      await store.dispatch(fetchDoctors());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: GET_DOCTORS, payload: mockData });
    });

    it('should dispatch DOCTOR_ERROR with payload on failure', async () => {
      const errorResponse = { msg: 'Error fetching doctors' };
      mockAxios.onGet('/api/doctors').reply(500, errorResponse);

      await store.dispatch(fetchDoctors());

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: DOCTOR_ERROR,
        payload: errorResponse,
      });
    });
  });
});
