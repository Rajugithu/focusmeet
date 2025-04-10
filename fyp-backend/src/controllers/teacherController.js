const Teacher = require('../models/Teacher');
const Session = require('../models/Session'); 
const Student = require('../models/Student'); 

// @desc   Get all teachers
// @route  GET /api/teachers
// @access Private (Admin only)
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Get a single teacher by ID
// @route  GET /api/teachers/:id
// @access Private
exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Update teacher details
// @route  PUT /api/teachers/:id
// @access Private
exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        teacher.name = req.body.name || teacher.name;
        teacher.email = req.body.email || teacher.email;
        teacher.subject = req.body.subject || teacher.subject;

        const updatedTeacher = await teacher.save();
        res.status(200).json({ message: "Teacher updated successfully", updatedTeacher });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Delete a teacher
// @route  DELETE /api/teachers/:id
// @access Private (Admin only)
exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        await teacher.deleteOne();
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Create a new session for a teacher
// @route  POST /api/teachers/:id/session
// @access Private
exports.createSession = async (req, res) => {
    try {
        console.log("Received Request Body:", req.body); // ✅ Debugging log

        const teacherId = req.params.id; // ✅ Extract from URL
        const { subject } = req.body;

        if (!subject) {
            return res.status(400).json({ message: "Subject is required" });
        }

        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const newSession = new Session({ teacherId, subject });
        await newSession.save();

        res.status(201).json(newSession);
    } catch (error) {
        console.error("Error Creating Session:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// @desc   Enroll students in a session
// @route  PUT /api/teachers/:id/session/:sessionId/enroll
// @access Private
exports.enrollStudents = async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const student = await Student.findById(req.body.studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (!session.students.includes(student._id)) {
            session.students.push(student._id);
            await session.save();
            res.status(200).json({ message: "Student enrolled successfully", session });
        } else {
            res.status(400).json({ message: "Student already enrolled" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Add a subject/class to a teacher
// @route  PUT /api/teachers/:id/add-class
// @access Private
exports.addClass = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        if (!teacher.subjects) {
            teacher.subjects = [];
        }

        if (!teacher.subjects.includes(req.body.subject)) {
            teacher.subjects.push(req.body.subject);
            await teacher.save();
            res.status(200).json({ message: "Class added successfully", teacher });
        } else {
            res.status(400).json({ message: "Class already exists" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   End an active session
// @route  PUT /api/teachers/:id/session/:sessionId/end
// @access Private
exports.endSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (!session.isActive) {
            return res.status(400).json({ message: "Session is already ended" });
        }

        session.isActive = false;
        session.endTime = new Date();
        await session.save();

        res.status(200).json({ message: "Session ended successfully", session });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
