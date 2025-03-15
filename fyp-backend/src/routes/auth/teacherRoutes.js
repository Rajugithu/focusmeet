const express = require('express');
const { getAllTeachers, getTeacherById, updateTeacher, deleteTeacher } = require('../controllers/teacherController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, admin, getAllTeachers);
router.get('/:id', protect, getTeacherById);
router.put('/:id', protect, updateTeacher);
router.delete('/:id', protect, admin, deleteTeacher);

module.exports = router;