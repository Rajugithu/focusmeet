const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    enrolledCourses: { type: [String], default: [] }
});

studentSchema.methods.enrollInLecture = async function (lectureId) {
    if (!this.enrolledLectures.includes(lectureId)) {
        this.enrolledLectures.push(lectureId);
        console.log(`Student ${this.name} enrolled in lecture ${lectureId}.`);
    } else {
        console.log(`Student ${this.name} is already enrolled.`);
    }
    return this.save();
};

studentSchema.methods.getEnrolledLectures = function () {
    return mongoose.model('Lecture').find({ _id: { $in: this.enrolledLectures } });
};

studentSchema.methods.updateEngagement = function (score) {
    this.engagementScore = score;
    return this.save();
};

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
