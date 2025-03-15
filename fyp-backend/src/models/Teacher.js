const User = require("./User");

class Teacher extends User {
    constructor(id, name, email, password) {
        super(id, name, email, password);
        this.createdClasses = []; // List of classes 
    }

    createClass(className) {
        if (!this.createdClasses.includes(className)) {
            this.createdClasses.push(className);
            console.log(`${this.name} has created the class: ${className}`);
        } else {
            console.log(`The class '${className}' already exists.`);
        }
    }

    viewCreatedClasses() {
        console.log(`Classes created by ${this.name}: ${this.createdClasses.join(", ") || "No classes created yet"}`);
    }
}

module.exports = Teacher;
