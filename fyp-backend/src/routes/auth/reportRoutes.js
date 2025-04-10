const express = require('express');
const {
    generateReport,
    getAllReports,
    getStudentReports,
    deleteReport
} = require('../controllers/reportController');
const { protect, admin, teacherOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, teacherOnly, generateReport);
router.get('/', protect, admin, getAllReports);
router.get('/student/:studentId', protect, getStudentReports);
router.delete('/:id', protect, teacherOnly, deleteReport);

module.exports = router;
