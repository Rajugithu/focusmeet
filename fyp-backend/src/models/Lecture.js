class Lecture {
    constructor(id, title, subject, teacherId, startTime, endTime) {
        this.id = id;
        this.title = title;
        this.subject = subject;
        this.teacherId = teacherId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.studentsEnrolled = [];
        this.isOngoing = false;
    }

    startLecture() {
        if (!this.isOngoing) {
            this.isOngoing = true;
            console.log(`Lecture "${this.title}" has started.`);
        } else {
            console.log(`Lecture "${this.title}" is already ongoing.`);
        }
    }

    endLecture() {
        if (this.isOngoing) {
            this.isOngoing = false;
            console.log(`Lecture "${this.title}" has ended.`);
        } else {
            console.log(`Lecture "${this.title}" is not active.`);
        }
    }

    enrollStudent(studentId) {
        if (!this.studentsEnrolled.includes(studentId)) {
            this.studentsEnrolled.push(studentId);
            console.log(`Student ${studentId} enrolled in lecture "${this.title}".`);
        } else {
            console.log(`Student ${studentId} is already enrolled.`);
        }
    }

    getLectureInfo() {
        console.log(`Lecture: ${this.title}, Subject: ${this.subject}, Teacher: ${this.teacherId}, Enrolled Students: ${this.studentsEnrolled.length}`);
    }
}

module.exports = Lecture;
