const Student = require('../models/Student');

const studentController = {
    getStudents: async (req, res) => {
        try {
            const students = await Student.find();
            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    // Adding new Student in the Data base.
    addStudent : async (req, res) => {
        try {
            console.log("Received Data:", req.body); // ✅ Log request body
    
            const { name, email, password, enrolledCourses } = req.body;
    
            if (!name || !email || !password) {
                return res.status(400).json({ message: "Please provide all required fields" });
            }
    
            // Hash the password before saving
            const bcrypt = require("bcryptjs");
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newStudent = new Student({ 
                name, 
                email, 
                password: hashedPassword, // ✅ Save hashed password
                enrolledCourses
            });
    
            await newStudent.save();
            res.status(201).json({ message: "Student added successfully", student: newStudent });
        } catch (error) {
            console.error("Error:", error.message); // ✅ Log actual error
            res.status(500).json({ message: "Error adding student", error: error.message });
        }
    },
    
    

// Retrive student from the database
    getStudentById: async (req, res) => {
        try {
            const student = await Student.findById(req.params.id);
            if (!student) {
                return res.status(404).json({ msg: 'Student not found' });
            }
            res.status(200).json(student);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },


    // Update student in the database
    updateStudent: async (req, res) => {
        try {
            const student = await Student.findById(req.params.id); // Corrected req.prams to req.params
            if (!student) {
                return res.status(404).json({ msg: 'Student not found' });
            }
            student.name = req.body.name || student.name;
            student.email = req.body.email || student.email;
            student.course = req.body.course || student.course;

            const updatedStudent = await student.save();
            res.status(200).json({ message: "Student details Updated", updatedStudent });
        } catch (error) {
            res.status(500).json({ message: "Server Error", error });
        }
    },


// Delete student from the database
    deleteStudent: async (req, res) => {
        try {
            const student = await Student.findById(req.params.id);
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            await student.deleteOne();
            res.status(200).json({ message: "Student deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

module.exports = studentController;