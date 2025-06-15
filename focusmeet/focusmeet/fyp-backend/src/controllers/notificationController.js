const Notification = require('../models/notification');
const User = require('../models/user');

// @desc   Send a notification to a user
// @route  POST /api/notifications
// @access Private (Only admin/teacher)
exports.sendNotification = async (req, res) => {
    try {
        const { userId, title, message } = req.body;

        if (!userId || !title || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const notification = new Notification({ user: userId, title, message });
        const savedNotification = await notification.save();
        
        res.status(201).json(savedNotification);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Get all notifications for a specific user
// @route  GET /api/notifications/:userId
// @access Private
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });

        if (!notifications.length) {
            return res.status(404).json({ message: "No notifications found for this user" });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Mark a notification as read
// @route  PATCH /api/notifications/:id/read
// @access Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Delete a notification
// @route  DELETE /api/notifications/:id
// @access Private
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        await notification.deleteOne();
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
