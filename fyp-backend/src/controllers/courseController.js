const Course = require('../models/course');

// Create a new course
exports.createCourse = async (req, res) => {
  console.log('Create course API hit with body:', req.body);
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor').populate('students');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor').populate('students');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enroll a student
exports.enrollStudent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (!course.students.includes(req.body.studentId)) {
      course.students.push(req.body.studentId);
      await course.save();
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
