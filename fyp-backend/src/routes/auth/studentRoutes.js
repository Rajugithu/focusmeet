const express = require('express');
const { getStudents, getStudentById, addStudent, updateStudent, deleteStudent } = require('../../controllers/studentController');
//const { protect } = require('../../middleware/authMiddleware');
const Student = require('../../models/Student');

const router = express.Router();


router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', addStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
