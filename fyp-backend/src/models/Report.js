class Report{
    constructor(reportId, lectureId, studentId,confidenceLevel, timeStamp){
        this.reportId = reportId;
        this.lectureId=lectureId;
        this.studentId=studentId;
        this.confidenceLevel=confidenceLevel,
        this.timeStamp=timeStamp;
    }

    generateReport(){
        return`
        Report ID: ${this.reportId}
        Lecture ID: ${this.lectureId}
        Student ID: ${this.studentId}
        Confidence Level: ${this.confidenceLevel}
        Time Stamp: ${this.timeStamp}
        `;
    }

}

module.exports = Report;
