class EngagementDetection {
    constructor(studentId, lectureId, confidenceLevel, lookingAway) {
        this.studentId = studentId;         // Student being analyzed
        this.lectureId = lectureId;         // Lecture in which engagement is being detected
        this.confidenceLevel = confidenceLevel; // Engagement confidence level (0-100)
        this.lookingAway = lookingAway;     // Boolean: Is student looking away?
    }

    analyzeStudent() {
        console.log(`📊 Analyzing engagement for Student ${this.studentId} in Lecture ${this.lectureId}...`);
        console.log(`🔍 Confidence Level: ${this.confidenceLevel}%`);
        console.log(`👀 Looking Away: ${this.lookingAway ? "Yes" : "No"}`);
    }

    detectDisengagement(threshold = 50) {
        if (this.confidenceLevel < threshold || this.lookingAway) {
            console.log(`⚠️ Alert: Student ${this.studentId} is disengaged in Lecture ${this.lectureId}!`);
            return true;
        }
        console.log(`✅ Student ${this.studentId} is engaged in Lecture ${this.lectureId}.`);
        return false;
    }
}

module.exports = EngagementDetection;
