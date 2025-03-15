const Teacher = require('../models/teacher');

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

        // Update fields
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