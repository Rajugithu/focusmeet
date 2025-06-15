const mongoose = require("mongoose");
require('dotenv').config();

console.log("Dotenv loaded:", process.env.MONGO_URI !== undefined); // Log if dotenv is loaded
console.log("Mongo URI:", process.env.MONGO_URI); // Log the Mongo URI for debugging

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Data Base connect successfuly");
    } catch (error) {
        console.error("DB not connected", error);
        process.exit(1);
    }
};

module.exports = connectDB;
