const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware to verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token and exclude the password field
            req.user = await User.findById(decoded.id).select('-password');

            // Check if user exists
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
        }
    }

    // If no token is found
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Role-based access control middleware
const roleBasedAccess = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. Only ${allowedRoles.join(', ')} can perform this action.` });
        }
        next();
    };
};

// Teacher-only middleware
const teacherOnly = roleBasedAccess(['teacher']);

module.exports = { protect, teacherOnly, roleBasedAccess };