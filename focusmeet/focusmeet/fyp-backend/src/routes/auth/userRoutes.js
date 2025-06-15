const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile, deleteProfile } = require('../../controllers/userController');
const { protect } = require('../../middleware/authMiddleware');  // Middleware for authentication

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes (Requires JWT)
router.get('/profile', protect, getProfile);
router.put('/update', protect, updateProfile);
router.delete('/delete', protect, deleteProfile);

module.exports = router;