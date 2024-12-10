import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from '../utils/api';
import MockAdapter from 'axios-mock-adapter';
import {
  GET_APPOINTMENTS,
  BOOK_APPOINTMENT,
  APPOINTMENT_ERROR,
  GET_AVAILABLE_TIME_SLOTS,
  GET_DOCTOR_CALENDAR,
} from '../actions/types';
import {
  getAppointments,
  bookAppointment,
  cancelAppointment,
  getAvailableTimeSlots,
  getDoctorCalendar,
} from '../actions/appointmentActions';

const mockStore = configureMockStore([thunk]);
const mockAxios = new MockAdapter(axios);

describe('Appointment Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    mockAxios.reset();
  });

  describe('getAppointments', () => {
    it('should dispatch GET_APPOINTMENTS on success', async () => {
      const mockData = [{ id: 1, doctor: 'Dr. Smith', date: '2024-12-10' }];
      mockAxios.onGet('/api/appointments').reply(200, mockData);

      await store.dispatch(getAppointments());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: GET_APPOINTMENTS, payload: mockData });
    });

    it('should dispatch APPOINTMENT_ERROR on failure', async () => {
      mockAxios.onGet('/api/appointments').reply(500);

      await store.dispatch(getAppointments());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: APPOINTMENT_ERROR });
    });
  });

  describe('bookAppointment', () => {
    it('should dispatch BOOK_APPOINTMENT and refresh appointments on success', async () => {
      const appointmentData = { doctorId: '123', date: '2024-12-11T10:00:00Z' };
      const mockResponse = { id: 'appointmentId', ...appointmentData };
      mockAxios.onPost('/api/appointments/book').reply(200, mockResponse);
      mockAxios.onGet('/api/appointments').reply(200, []);

      await store.dispatch(bookAppointment(appointmentData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: BOOK_APPOINTMENT, payload: mockResponse });
      expect(actions[1]).toEqual({ type: GET_APPOINTMENTS, payload: [] });
    });

    it('should dispatch APPOINTMENT_ERROR on failure', async () => {
      const appointmentData = { doctorId: '123', date: '2024-12-11T10:00:00Z' };
      const errorResponse = { msg: 'Booking failed' };
      mockAxios.onPost('/api/appointments/book').reply(400, errorResponse);

      await store.dispatch(bookAppointment(appointmentData));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: APPOINTMENT_ERROR, payload: errorResponse });
    });
  });

  describe('cancelAppointment', () => {
    it('should refresh appointments on successful cancellation', async () => {
      const appointmentId = 'appointment123';
      mockAxios.onPut(`/api/appointments/${appointmentId}/cancel`).reply(200);
      mockAxios.onGet('/api/appointments').reply(200, []);

      await store.dispatch(cancelAppointment(appointmentId));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: GET_APPOINTMENTS, payload: [] });
    });

    it('should dispatch APPOINTMENT_ERROR on failure', async () => {
      const appointmentId = 'appointment123';
      const errorResponse = { msg: 'Cancellation failed' };
      mockAxios.onPut(`/api/appointments/${appointmentId}/cancel`).reply(400, errorResponse);

      await store.dispatch(cancelAppointment(appointmentId));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: APPOINTMENT_ERROR, payload: errorResponse });
    });
  });

  describe('getAvailableTimeSlots', () => {
    it('should dispatch GET_AVAILABLE_TIME_SLOTS on success', async () => {
      const mockData = { timeSlots: [{ start: '10:00', end: '10:30', isAvailable: true }] };
      mockAxios.onGet('/api/appointments/available').reply(200, mockData);

      await store.dispatch(getAvailableTimeSlots('doctor123', '2024-12-12'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: GET_AVAILABLE_TIME_SLOTS,
        payload: mockData.timeSlots,
      });
    });

    it('should dispatch APPOINTMENT_ERROR on failure', async () => {
      mockAxios.onGet('/api/appointments/available').reply(500);

      await store.dispatch(getAvailableTimeSlots('doctor123', '2024-12-12'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: APPOINTMENT_ERROR,
        payload: { msg: 'An error occurred' },
      });
    });
  });

  describe('getDoctorCalendar', () => {
    it('should dispatch GET_DOCTOR_CALENDAR on success', async () => {
      const mockData = { timeSlots: [{ start: '10:00', end: '10:30', isBooked: false }] };
      mockAxios.onGet('/api/appointments/calendar').reply(200, mockData);

      await store.dispatch(getDoctorCalendar('doctor123', '2024-12-12'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: GET_DOCTOR_CALENDAR,
        payload: mockData.timeSlots,
      });
    });

    it('should dispatch APPOINTMENT_ERROR on failure', async () => {
      mockAxios.onGet('/api/appointments/calendar').reply(500);

      await store.dispatch(getDoctorCalendar('doctor123', '2024-12-12'));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: APPOINTMENT_ERROR,
        payload: { msg: 'Failed to fetch calendar data' },
      });
    });
  });
});
