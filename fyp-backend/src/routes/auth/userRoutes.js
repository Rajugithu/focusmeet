const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');  // Middleware for authentication

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes (Requires JWT)
router.get('/profile', protect, getUserProfile);
router.put('/update', protect, updateUser);
router.delete('/delete', protect, deleteUser);

module.exports = router;