const express = require('express');
const { createLecture, getAllLectures, getLectureById, updateLecture, deleteLecture } = require('../../controllers/lectureController');
const {teacherOnly} = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', createLecture);
router.get('/', getAllLectures);
router.get('/:id', getLectureById);
router.put('/:id', teacherOnly, updateLecture);
router.delete('/:id', teacherOnly, deleteLecture);

module.exports = router;
