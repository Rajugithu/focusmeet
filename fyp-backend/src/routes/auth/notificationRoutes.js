const express = require('express');
const {
    sendNotification,
    getUserNotifications,
    markAsRead,
    deleteNotification
} = require('../controllers/notificationController');
const { protect, admin, teacherOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, teacherOnly, sendNotification);
router.get('/:userId', protect, getUserNotifications);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
