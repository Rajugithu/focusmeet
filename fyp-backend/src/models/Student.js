const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // ✅ Ensure this is included
    enrolledCourses: { type: [String], default: [] }
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
