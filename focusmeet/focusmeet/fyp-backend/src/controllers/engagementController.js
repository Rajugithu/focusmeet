const Engagement = require('../models/engagementDetector');
const Student = require('../models/Student');
const Lecture = require('../models/Lecture');

// @desc   Record student engagement in a lecture
// @route  POST /api/engagement
// @access Private (Only students)
exports.recordEngagement = async (req, res) => {
    try {
        const { studentId, lectureId, attentionScore, participationScore } = req.body;

        if (!studentId || !lectureId || attentionScore === undefined || participationScore === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const student = await Student.findById(studentId);
        const lecture = await Lecture.findById(lectureId);

        if (!student || !lecture) {
            return res.status(404).json({ message: "Student or Lecture not found" });
        }

        const engagement = new Engagement({ student: studentId, lecture: lectureId, attentionScore, participationScore });
        const savedEngagement = await engagement.save();
        res.status(201).json(savedEngagement);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Get all engagement records
// @route  GET /api/engagement
// @access Private (Only teachers/admin)
exports.getAllEngagements = async (req, res) => {
    try {
        const engagements = await Engagement.find().populate('student', 'name email').populate('lecture', 'title date');
        res.status(200).json(engagements);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Get engagement data for a specific student
// @route  GET /api/engagement/student/:studentId
// @access Private
exports.getEngagementByStudent = async (req, res) => {
    try {
        const engagements = await Engagement.find({ student: req.params.studentId }).populate('lecture', 'title date');
        if (!engagements.length) {
            return res.status(404).json({ message: "No engagement records found for this student" });
        }
        res.status(200).json(engagements);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Get engagement data for a specific lecture
// @route  GET /api/engagement/lecture/:lectureId
// @access Private
exports.getEngagementByLecture = async (req, res) => {
    try {
        const engagements = await Engagement.find({ lecture: req.params.lectureId }).populate('student', 'name email');
        if (!engagements.length) {
            return res.status(404).json({ message: "No engagement records found for this lecture" });
        }
        res.status(200).json(engagements);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Delete an engagement record
// @route  DELETE /api/engagement/:id
// @access Private (Only admin)
exports.deleteEngagement = async (req, res) => {
    try {
        const engagement = await Engagement.findById(req.params.id);
        if (!engagement) {
            return res.status(404).json({ message: "Engagement record not found" });
        }

        await engagement.deleteOne();
        res.status(200).json({ message: "Engagement record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
