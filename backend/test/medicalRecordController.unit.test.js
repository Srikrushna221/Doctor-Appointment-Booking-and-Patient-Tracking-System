const {
    addOrUpdateMedicalRecord,
    getMedicalHistory,
    saveMedicalRecord,
    getMedicalRecords,
  } = require('../controllers/medicalRecordController');
  const MedicalRecord = require('../models/MedicalRecord');
  const User = require('../models/User');
  
  jest.mock('../models/MedicalRecord');
  jest.mock('../models/User');
  
  describe('Medical Record Controller', () => {
    let res;
  
    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
  
      jest.clearAllMocks();
    });
  
    describe('addOrUpdateMedicalRecord', () => {
      it('should update an existing medical record', async () => {
        const mockRecord = {
          id: 'record1',
          patientId: 'patient1',
          records: [],
          save: jest.fn().mockResolvedValue(),
        };
  
        User.findById.mockResolvedValue({ id: 'patient1', role: 'Patient' });
        MedicalRecord.findOne.mockResolvedValue(mockRecord);
  
        const req = {
          body: {
            patientId: 'patient1',
            description: 'Updated Test',
            prescription: 'Updated Prescription',
          },
          user: { id: 'doctor1' },
        };
  
        await addOrUpdateMedicalRecord(req, res);
  
        expect(mockRecord.records).toHaveLength(1);
        expect(mockRecord.records[0]).toEqual({
          doctorId: 'doctor1',
          description: 'Updated Test',
          prescription: 'Updated Prescription',
        });
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({ msg: 'Medical record updated' })
        );
      });
  
      it('should return 404 if the patient is not found', async () => {
        User.findById.mockResolvedValue(null);
  
        const req = {
          body: {
            patientId: 'patient1',
            description: 'Test',
            prescription: 'Test Prescription',
          },
          user: { id: 'doctor1' },
        };
  
        await addOrUpdateMedicalRecord(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Patient not found' });
      });
    });
  
    describe('getMedicalHistory', () => {
      it('should return the medical history of a patient', async () => {
        MedicalRecord.findOne.mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            id: 'record1',
            patientId: 'patient1',
            records: [
              {
                doctorId: { id: 'doctor1', name: 'Dr. Smith', specialization: 'Cardiology' },
                description: 'Test',
                prescription: 'Test Prescription',
              },
            ],
          }),
        });
  
        const req = {
          params: { patientId: 'patient1' },
          user: { id: 'patient1', role: 'Patient' },
        };
  
        await getMedicalHistory(req, res);
  
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'record1', patientId: 'patient1' })
        );
      });
  
      it('should return 404 if no medical history is found', async () => {
        MedicalRecord.findOne.mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        });
  
        const req = {
          params: { patientId: 'patient1' },
          user: { id: 'patient1', role: 'Patient' },
        };
  
        await getMedicalHistory(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Medical records not found' });
      });
    });
  
    describe('getMedicalRecords', () => {
      it('should fetch medical records for a patient', async () => {
        MedicalRecord.find.mockReturnValue({
          populate: jest.fn().mockResolvedValue([
            {
              id: 'record1',
              doctorId: { id: 'doctor1', name: 'Dr. Smith' },
              record: 'Test Record',
            },
          ]),
        });
  
        const req = { params: { patientId: 'patient1' } };
  
        await getMedicalRecords(req, res);
  
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({ records: expect.any(Array) })
        );
      });
  
      it('should return server error if fetching fails', async () => {
        MedicalRecord.find.mockImplementation(() => {
          throw new Error('Database error');
        });
  
        const req = { params: { patientId: 'patient1' } };
  
        await getMedicalRecords(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
      });
    });
  });
  