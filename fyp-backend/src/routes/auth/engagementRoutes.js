const express = require('express');
const {
    recordEngagement,
    getAllEngagements,
    getEngagementByStudent,
    getEngagementByLecture,
    deleteEngagement
} = require('../controllers/engagementController');
const { protect, studentOnly, teacherOnly, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, studentOnly, recordEngagement);
router.get('/', protect, teacherOnly, getAllEngagements);
router.get('/student/:studentId', protect, getEngagementByStudent);
router.get('/lecture/:lectureId', protect, getEngagementByLecture);
router.delete('/:id', protect, admin, deleteEngagement);

module.exports = router;
