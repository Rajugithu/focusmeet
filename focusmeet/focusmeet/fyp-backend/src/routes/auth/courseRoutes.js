const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/courseController');

// Create course
console.log('✅ courseRoutes loaded');
router.post('/create', courseController.createCourse);
console.log('✅ courseRoutes loaded');

// Get all courses
router.get('/all', courseController.getAllCourses);

// Get course by ID
router.get('/:id', courseController.getCourseById);

// Enroll student in a course
router.post('/:id/enroll', courseController.enrollStudent);

module.exports = router;