import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import api from '../utils/api';
import {
  SAVE_RECORD,
  FETCH_RECORDS,
  RECORD_ERROR,
} from '../actions/types';
import {
  saveMedicalRecord,
  fetchMedicalRecords,
} from '../actions/medicalRecordActions';

const mockStore = configureMockStore([thunk]);
const mockAxios = new MockAdapter(api);

describe('Medical Record Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: { user: { _id: 'user123' } }, // Mock user data
    });
    mockAxios.reset();
  });

  describe('saveMedicalRecord', () => {
    it('should dispatch SAVE_RECORD on successful save', async () => {
      const mockRecord = { patientId: 'patient123', record: 'Medical notes' };
      const mockResponse = { medicalRecord: { ...mockRecord, doctorId: 'user123' } };
      mockAxios.onPost('/api/medicalRecords').reply(200, mockResponse);

      await store.dispatch(saveMedicalRecord(mockRecord));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: SAVE_RECORD, payload: mockResponse.medicalRecord });
    });

    it('should dispatch RECORD_ERROR if required fields are missing', async () => {
      const incompleteRecord = { record: 'Incomplete data' };

      await store.dispatch(saveMedicalRecord(incompleteRecord));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: RECORD_ERROR,
        payload: { msg: 'Error saving record' },
      });
    });

    it('should dispatch RECORD_ERROR on API failure', async () => {
      const mockRecord = { patientId: 'patient123', record: 'Medical notes' };
      mockAxios.onPost('/api/medicalRecords').reply(500);

      await store.dispatch(saveMedicalRecord(mockRecord));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: RECORD_ERROR,
        payload: { msg: 'Error saving record' },
      });
    });
  });

  describe('fetchMedicalRecords', () => {
    it('should dispatch FETCH_RECORDS on success', async () => {
      const mockRecords = [{ id: '1', notes: 'Patient history' }];
      mockAxios.onGet('/api/medicalRecords/user123').reply(200, { records: mockRecords });

      await store.dispatch(fetchMedicalRecords());

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: FETCH_RECORDS, payload: mockRecords });
    });

    it('should dispatch RECORD_ERROR if patient ID is undefined', async () => {
      store = mockStore({ auth: { user: null } });

      await store.dispatch(fetchMedicalRecords());

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: RECORD_ERROR,
        payload: { msg: 'Error fetching records' },
      });
    });

    it('should dispatch RECORD_ERROR on API failure', async () => {
      mockAxios.onGet('/api/medicalRecords/user123').reply(500);

      await store.dispatch(fetchMedicalRecords());

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: RECORD_ERROR,
        payload: { msg: 'Error fetching records' },
      });
    });
  });
});
