const Report = require('../models/report');
const User = require('../models/User');
const Lecture = require('../models/Lecture');

// @desc   Generate a report based on engagement data
// @route  POST /api/reports
// @access Private (Teacher/Admin)
exports.generateReport = async (req, res) => {
    try {
        const { lectureId, studentId, engagementScore, remarks } = req.body;

        if (!lectureId || !studentId || engagementScore === undefined) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        const report = new Report({ lecture: lectureId, student: studentId, engagementScore, remarks });
        const savedReport = await report.save();

        res.status(201).json(savedReport);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Get all reports (Admin/Teacher)
// @route  GET /api/reports
// @access Private
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('student', 'name email').populate('lecture', 'title date');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Get reports for a specific student
// @route  GET /api/reports/student/:studentId
// @access Private (Student/Teacher)
exports.getStudentReports = async (req, res) => {
    try {
        const reports = await Report.find({ student: req.params.studentId }).populate('lecture', 'title date');

        if (!reports.length) {
            return res.status(404).json({ message: "No reports found for this student" });
        }

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Delete a report
// @route  DELETE /api/reports/:id
// @access Private (Admin/Teacher)
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        await report.deleteOne();
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
