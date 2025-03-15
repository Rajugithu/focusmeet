const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user'); 
require('dotenv').config();

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({ name, email, password });

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to the database
        await user.save();

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, msg: 'User registered successfully' });
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
