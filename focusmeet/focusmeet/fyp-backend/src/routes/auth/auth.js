const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Teacher = require("../../models/Teacher");
require('dotenv').config();

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body; // Add role here

  try {
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({ name, email, password, role }); // Include role here

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = { user: { id: user.id, role: user.role } }; // Include role in payload
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
          if (err) throw err;
          res.json({ token, msg: 'User registered successfully', role: user.role });
      });

  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (process.env.NODE_ENV !== 'test') {
        console.log('Login request received:', { email, password }); 
      }
  
      let user = await User.findOne({ email });
  
      if (process.env.NODE_ENV !== 'test') {
        console.log('User found:', user); 
      }
  
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (process.env.NODE_ENV !== 'test') {
        console.log('Password match:', isMatch); 
      }
  
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
  
        if (process.env.NODE_ENV !== 'test') {
          console.log('Token generated:', token);
        }
  
        res.json({ token, msg: 'Login successful' });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
