const Lecture = require('../models/Lecture');


exports.createLecture = async (req, res) => {
    try {
        const { title, description, teacher, date, duration } = req.body;

        if (!title || !teacher || !date || !duration) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const lecture = new Lecture({ title, description, teacher, date, duration });
        const savedLecture = await lecture.save();
    
        res.status(201).json(savedLecture);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Get all lectures
// @route  GET /api/lectures
// @access Private
exports.getAllLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find().populate('teacher', 'name email');
        res.status(200).json(lectures);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Get a single lecture by ID
// @route  GET /api/lectures/:id
// @access Private
exports.getLectureById = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id).populate('teacher', 'name email');
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }
        res.status(200).json(lecture);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Update lecture details
// @route  PUT /api/lectures/:id
// @access Private (Only teachers)
exports.updateLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        // Update fields
        lecture.title = req.body.title || lecture.title;
        lecture.description = req.body.description || lecture.description;
        lecture.date = req.body.date || lecture.date;
        lecture.duration = req.body.duration || lecture.duration;

        const updatedLecture = await lecture.save();
        res.status(200).json({ message: "Lecture updated successfully", updatedLecture });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc   Delete a lecture
// @route  DELETE /api/lectures/:id
// @access Private (Only teachers or admin)
exports.deleteLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        await lecture.deleteOne();
        res.status(200).json({ message: "Lecture deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
