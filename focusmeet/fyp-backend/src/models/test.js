// const User = require("./User");
// const Student = require("./Student");
// const Teacher = require("./Teacher");

// // Creating a Student
// const student1 = new Student(1, "Ali Khan", "ali@example.com", "password123", "12th Grade");
// console.log(student1.displayInfo());
// student1.enrollInCourse("Math");

// // Creating a Teacher
// const teacher1 = new Teacher(2, "Dr. Ahmed", "ahmed@example.com", "securePass", "Physics");
// console.log(teacher1.displayInfo());
// teacher1.assignLecture("Quantum Mechanics");

// // Updating user info
// student1.updateProfile("Ali Khan Jr.", "ali.khan@example.com", "newpassword123");
// console.log(student1.displayInfo());


// const Student = require("./Student");

// const student1 = new Student(1, "Ali Khan", "ali@example.com", "password123");

// console.log(student1.displayInfo());  // Should print user info

// student1.enroll("Math");
// student1.enroll("Physics");
// student1.enroll("Math");  

// student1.viewCourses();  



// const Teacher = require("./Teacher");

// const teacher1 = new Teacher(101, "Dr. Ahmed", "ahmed@example.com", "securePass");

// console.log(teacher1.displayInfo());

// teacher1.createClass("Computer Science 101");
// teacher1.createClass("Artificial Intelligence");
// teacher1.createClass("Computer Science 101");  

// teacher1.viewCreatedClasses();  // Shows created classes
 
// const Lecture = require("./Lecture");

// const lecture1 = new Lecture(1, "Intro to AI", "Artificial Intelligence", 101, "10:00 AM", "11:30 AM");

// lecture1.getLectureInfo(); 

// lecture1.startLecture(); 
// lecture1.enrollStudent(201); 
// lecture1.enrollStudent(202);  
// lecture1.enrollStudent(201);  

// lecture1.getLectureInfo(); 
// lecture1.endLecture(); 


// const Report = require("./Report");

// // Test Data
// const testReport = new Report(1, 101, "S123", 85.5, new Date("2024-02-25T10:30:00Z"));

// // Test: Check if the attributes are correctly assigned
// console.log("🔍 Testing Report Attributes:");
// console.log(testReport.reportId === 1 ? "✅ reportId is correct" : "❌ reportId is incorrect");
// console.log(testReport.lectureId === 101 ? "✅ lectureId is correct" : "❌ lectureId is incorrect");
// console.log(testReport.studentId === "S123" ? "✅ studentId is correct" : "❌ studentId is incorrect");
// console.log(testReport.confidenceLevel === 85.5 ? "✅ confidenceLevel is correct" : "❌ confidenceLevel is incorrect");
// console.log(testReport.timeStamp.toISOString() === "2024-02-25T10:30:00.000Z" ? "✅ timestamp is correct" : "❌ timestamp is incorrect");

// // Test: Check generateReport() output
// console.log("\n🔍 Testing generateReport Method:");
// console.log(testReport.generateReport());


const Notification = require('./Notification'); // Import the Notification class

// Test data
const receiverId = "student_123";
const message = "Your lecture is starting soon!";

// Create a notification instance
const notification = new Notification(receiverId, message);

// Display notification details
console.log("🔍 Testing Notification Class...");
console.log(`Receiver ID: ${notification.receiverId}`);
console.log(`Message: ${notification.message}`);
console.log(`TimeStamp: ${notification.timeStamp}`);

// Test the sendNotification() method
notification.sendNotification();


