const { bookAppointment, cancelAppointment, getAvailableTimeSlots } = require('../controllers/appointmentController');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

jest.mock('../models/Appointment');
jest.mock('../models/User');

describe('Appointment Controller', () => {
  describe('bookAppointment', () => {
    it('should book an appointment successfully', async () => {
      // Mock the doctor
      User.findById.mockResolvedValue({ _id: 'doctorId', role: 'Doctor' });
      // No conflicts
      Appointment.findOne.mockResolvedValue(null);
      // Mock saving
      Appointment.prototype.save = jest.fn().mockResolvedValue({
        _id: 'appointmentId',
        patientId: 'patientId',
        doctorId: 'doctorId',
        date: new Date(),
        endDate: new Date(),
      });

      const req = {
        body: { doctorId: 'doctorId', date: new Date(Date.now() + 3600000).toISOString() },
        user: { id: 'patientId' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await bookAppointment(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        msg: 'Appointment booked successfully',
        appointment: expect.any(Object),
      }));
    });

    it('should return error if doctor not found', async () => {
      User.findById.mockResolvedValue(null);

      const req = {
        body: { doctorId: 'doctorId', date: new Date().toISOString() },
        user: { id: 'patientId' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await bookAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Doctor not found' });
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel an appointment successfully', async () => {
      Appointment.findById.mockResolvedValue({
        _id: 'appointmentId',
        patientId: 'patientId',
        doctorId: 'doctorId',
        status: 'Scheduled',
        save: jest.fn().mockResolvedValue(),
      });

      const req = {
        params: { id: 'appointmentId' },
        user: { id: 'patientId' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cancelAppointment(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ msg: 'Appointment cancelled successfully' });
    });

    it('should return error if appointment not found', async () => {
      Appointment.findById.mockResolvedValue(null);

      const req = {
        params: { id: 'appointmentId' },
        user: { id: 'patientId' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cancelAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Appointment not found' });
    });
  });

  describe('getAvailableTimeSlots', () => {
    it('should return available time slots', async () => {
      User.findById.mockResolvedValue({ _id: 'doctorId', role: 'Doctor' });
      Appointment.find.mockResolvedValue([]); // No appointments

      const req = {
        query: { doctorId: 'doctorId', date: new Date().toISOString() },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAvailableTimeSlots(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        timeSlots: expect.any(Array),
      }));
    });

    it('should return error if doctor not found', async () => {
      User.findById.mockResolvedValue(null);

      const req = {
        query: { doctorId: 'doctorId', date: new Date().toISOString() },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAvailableTimeSlots(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Doctor not found' });
    });
  });
});
