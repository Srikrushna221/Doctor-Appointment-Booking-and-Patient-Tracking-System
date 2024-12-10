const {
    getAllDoctors,
    getDoctorProfile,
    addOrUpdateDoctorDescription,
    addDoctorRating,
    getDoctorRating,
  } = require('../controllers/doctorController');
  const User = require('../models/User');
  
  jest.mock('../models/User');
  
  describe('Doctor Controller', () => {
    let res;
    beforeEach(() => {
      // Mock res object
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
  
      jest.clearAllMocks(); // Reset mocks before each test
    });
  
    describe('getAllDoctors', () => {
      it('should return a list of all doctors', async () => {
        // Mock User.find to return a list of doctors with a chained select
        User.find.mockReturnValue({
          select: jest.fn().mockResolvedValue([
            { id: '1', name: 'Dr. Smith', role: 'Doctor' },
            { id: '2', name: 'Dr. Jane', role: 'Doctor' },
          ]),
        });
  
        const req = {}; // No specific request data required
  
        await getAllDoctors(req, res);
  
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith([
          { id: '1', name: 'Dr. Smith', role: 'Doctor' },
          { id: '2', name: 'Dr. Jane', role: 'Doctor' },
        ]);
      });
  
      it('should handle server errors', async () => {
        User.find.mockImplementation(() => {
          throw new Error('Database error');
        });
  
        const req = {};
  
        await getAllDoctors(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server Error');
      });
    });
  
    describe('getDoctorProfile', () => {
      it('should return the doctor profile', async () => {
        User.findById.mockReturnValue({
          select: jest.fn().mockResolvedValue({
            id: '1',
            name: 'Dr. Smith',
            role: 'Doctor',
          }),
        });
  
        const req = { params: { id: '1' } };
  
        await getDoctorProfile(req, res);
  
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
          id: '1',
          name: 'Dr. Smith',
          role: 'Doctor',
        });
      });
  
      it('should return 404 if doctor is not found', async () => {
        User.findById.mockReturnValue({
          select: jest.fn().mockResolvedValue(null),
        });
  
        const req = { params: { id: '1' } };
  
        await getDoctorProfile(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Doctor not found' });
      });
    });
  
    // Additional test cases for other methods...
  });
  