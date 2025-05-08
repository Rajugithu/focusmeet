const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/courseController');

// Create course
router.post('/', courseController.createCourse);

// Get all courses
router.get('/', courseController.getAllCourses);

// Get course by ID
router.get('/:id', courseController.getCourseById);

// Enroll student in a course
router.post('/:id/enroll', courseController.enrollStudent);

module.exports = router;