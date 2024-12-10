const { registerUser, loginUser, getUser } = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null); // No user exists with email or name
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockResolvedValue({
        id: 'userId',
        role: 'Doctor',
        name: 'Dr. John',
        email: 'john@example.com',
      });
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'mockToken');
      });

      const req = {
        body: {
          role: 'Doctor',
          name: 'Dr. John',
          email: 'john@example.com',
          password: 'password123',
          specialization: 'Cardiology',
          description: 'Experienced Cardiologist',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await registerUser(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        token: 'mockToken',
        user: expect.any(Object),
      });
    });

    it('should return error if email already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'john@example.com' }); // Email already exists

      const req = {
        body: {
          role: 'Doctor',
          name: 'Dr. John',
          email: 'john@example.com',
          password: 'password123',
          specialization: 'Cardiology',
          description: 'Experienced Cardiologist',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: `A Doctor with the mail "john@example.com" already exists. Please use a different mail.`,
      });
    });

    it('should return error if name and role already exist', async () => {
      User.findOne
        .mockResolvedValueOnce(null) // Email does not exist
        .mockResolvedValueOnce({ name: 'Dr. John', role: 'Doctor' }); // Name exists

      const req = {
        body: {
          role: 'Doctor',
          name: 'Dr. John',
          email: 'john@example.com',
          password: 'password123',
          specialization: 'Cardiology',
          description: 'Experienced Cardiologist',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: `A Doctor with the name "Dr. John" already exists. Please use a different name.`,
      });
    });
  });

  describe('loginUser', () => {
    it('should login successfully', async () => {
      User.findOne.mockResolvedValue({
        id: 'userId',
        role: 'Patient',
        email: 'john@example.com',
        password: 'hashedPassword',
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'mockToken');
      });

      const req = {
        body: { email: 'john@example.com', password: 'password123' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await loginUser(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        token: 'mockToken',
        user: expect.any(Object),
      });
    });

    it('should return error if credentials are invalid', async () => {
      User.findOne.mockResolvedValue(null); // User does not exist

      const req = {
        body: { email: 'john@example.com', password: 'password123' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Credentials' });
    });

    it('should return error if password does not match', async () => {
      User.findOne.mockResolvedValue({
        id: 'userId',
        role: 'Patient',
        email: 'john@example.com',
        password: 'hashedPassword',
      });
      bcrypt.compare.mockResolvedValue(false); // Password mismatch

      const req = {
        body: { email: 'john@example.com', password: 'wrongPassword' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Credentials' });
    });
  });

  describe('getUser', () => {
    it('should return user details successfully', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          id: 'userId',
          role: 'Patient',
          name: 'John Doe',
          email: 'john@example.com',
        }),
      });
  
      const req = { user: { id: 'userId' } };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
  
      await getUser(req, res);
  
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 'userId',
        role: 'Patient',
        name: 'John Doe',
        email: 'john@example.com',
      }));
    });
  
    it('should return error if user is not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
  
      const req = { user: { id: 'nonexistentUserId' } };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
  
      await getUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: 'User not found' });
    });
  });  
});
