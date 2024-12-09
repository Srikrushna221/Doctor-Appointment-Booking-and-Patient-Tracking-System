const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
exports.registerUser = async (req, res) => {
  const { role, name, email, password, specialization, description } = req.body;

  try {
    // Check if a user with the same email already exists
    let user = await User.findOne({ email });
    if (user){
       return res
          .status(400)
          .json({ msg: `A ${role} with the mail "${email}" already exists. Please use a different mail.` });
    }
    // Check if a user with the same name and role already exists
    const existingUserWithName = await User.findOne({ name, role });
    if (existingUserWithName) {
      return res
        .status(400)
        .json({ msg: `A ${role} with the name "${name}" already exists. Please use a different name.` });
    }

    // Create a new user instance
    user = new User({
      role,
      name,
      email,
      password,
      specialization,
      description,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return JWT
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ msg: 'Invalid Credentials' });

    // Return JWT
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Authenticated User
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
