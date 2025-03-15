const express = require('express');
const { createLecture, getAllLectures, getLectureById, updateLecture, deleteLecture } = require('../controllers/lectureController');
const { protect, teacherOnly, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, teacherOnly, createLecture);
router.get('/', protect, getAllLectures);
router.get('/:id', protect, getLectureById);
router.put('/:id', protect, teacherOnly, updateLecture);
router.delete('/:id', protect, teacherOnly, deleteLecture);

module.exports = router;
