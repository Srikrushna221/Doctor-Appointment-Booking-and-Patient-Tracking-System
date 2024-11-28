// routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user (Patient or Doctor)
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

// @route   GET api/auth/user
// @desc    Get authenticated user
// @access  Private
router.get('/user', authenticateToken, getUser);

module.exports = router;
