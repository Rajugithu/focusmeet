const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user'); // Adjust the path as needed
require('dotenv').config();

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`Attempting to log in with email: ${email}`); // Log the email
        // Check if user exists
        let user = await User.findOne({ email });
        console.log(`User found: ${user ? 'Yes' : 'No'}`); // Log if user exists

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        console.log(`Comparing passwords for user: ${email}`); // Log password comparison

        console.log(`Password from database: ${user.password}`); // Log the hashed password
        console.log(`Password provided: ${password}`); // Log the plain password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
