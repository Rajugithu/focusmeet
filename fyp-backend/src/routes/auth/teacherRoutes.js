const express = require("express");
const router = express.Router();
const { getAllTeachers, getTeacherById, createSession, enrollStudents, addClass, endSession } = require("../../controllers/teacherController");

// Routes for teacher management
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);

// Session-related routes
router.post("/:id/session", createSession);
router.put("/:id/session/:sessionId/enroll", enrollStudents);
router.put("/:id/session/:sessionId/end", endSession);

// Add subject/class
router.put("/:id/add-class", addClass);

module.exports = router;
