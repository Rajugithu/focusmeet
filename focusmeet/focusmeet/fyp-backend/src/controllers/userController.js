const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new User
exports.registerUser = async (req, res) => {
    try {

        // console.log("Received signup request:", req.body);

        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user (password stored in plain text)
        const newUser = new User({ name, email, password, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login a User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials jkhkjhjkhk' });
        }

        // Compare password (plain text comparison)
        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid credentials jhkkhkjhk' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    console.log("req.user:", req.user);
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true });
        res.status(200).json({ message: "User information updated", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete User Profile
exports.deleteProfile = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};