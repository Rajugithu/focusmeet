const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subjects: [{ type: String, required: true }], // List of subjects teacher teaches
    sessions: [{ 
        title: String, 
        studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
        isActive: { type: Boolean, default: false }
    }]
});

// Method to create a new session
teacherSchema.methods.createSession = function(title) {
    const newSession = { title, studentsEnrolled: [], isActive: true };
    this.sessions.push(newSession);
    return this.save();
};

// Method to enroll students in a session
teacherSchema.methods.enrollStudents = function(sessionId, studentIds) {
    const session = this.sessions.id(sessionId);
    if (!session) throw new Error("Session not found");
    
    studentIds.forEach(id => {
        if (!session.studentsEnrolled.includes(id)) {
            session.studentsEnrolled.push(id);
        }
    });
    
    return this.save();
};

// Method to add subjects a teacher teaches
teacherSchema.methods.addClass = function(subject) {
    if (!this.subjects.includes(subject)) {
        this.subjects.push(subject);
    }
    return this.save();
};

// Method to end a session
teacherSchema.methods.endSession = function(sessionId) {
    const session = this.sessions.id(sessionId);
    if (!session) throw new Error("Session not found");

    session.isActive = false;
    return this.save();
};

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
