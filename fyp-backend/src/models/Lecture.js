const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    title: {type: String,required: true},
    teacherId: {type: mongoose.Schema.Types.ObjectId,ref: 'Teacher',required: true},
    subject: {type: String,required: true},
    startTime: {type: Date,default: Date.now},
    endTime: {type: Date},
    isActive: {type: Boolean,default: true},
    students: [{type: mongoose.Schema.Types.ObjectId,ref: 'Student'}]
}, { timestamps: true });

/** 
 * Method: End Lecture
 * Marks the lecture as completed
 */
LectureSchema.methods.endLecture = async function () {
    this.endTime = new Date();
    this.isActive = false;
    await this.save();
};

/**
 * Static Method: Find Active Lectures
 * Returns all currently active lectures
 */
LectureSchema.statics.findActiveLectures = function () {
    return this.find({ isActive: true });
};

/**
 * Method: Add Student to Lecture
 * Adds a student to the lecture session
 */
LectureSchema.methods.addStudent = async function (studentId) {
    if (!this.students.includes(studentId)) {
        this.students.push(studentId);
        await this.save();
    }
};

const Lecture = mongoose.model('Lecture', LectureSchema);
module.exports = Lecture;
