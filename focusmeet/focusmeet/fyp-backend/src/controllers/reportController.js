const { saveReport, readReports } = require('../models/reportModel');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const Report = require('../models/reportModel'); 

const studentSockets = {}; // store student socket references

function registerSocket(studentId, socket) {
    studentSockets[studentId] = socket;
}

async function handleReport(req, res) {
    const { studentId, status } = req.body;

    if (!studentId || !status) {
        return res.status(400).json({ error: 'Missing studentId or status' });
    }

    const timestamp = new Date().toISOString();
    await saveReport({ timestamp, studentId, status });

    // Notify if distracted
    if (status === 'distracted' && studentSockets[studentId]) {
        studentSockets[studentId].emit('distracted-alert', {
            message: 'You seem distracted. Please pay attention.',
        });
    }

    res.json({ success: true });
}

function getReport(req, res) {
    const reports = readReports();
    res.json(reports);
}

const exportReportsToCSV = async (req, res) => {
    try {
        const reports = await Report.find().lean(); // get plain JS objects

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found' });
        }

        const fields = Object.keys(reports[0]);
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(reports);

        const filePath = path.join(__dirname, '../../exports/reports.csv');

        // Create folder if not exists
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        fs.writeFileSync(filePath, csv);

        res.download(filePath); // send the file to client

    } catch (error) {
        console.error('CSV export error:', error);
        res.status(500).json({ message: 'Failed to export reports' });
    }
};

module.exports = { handleReport, getReport, registerSocket, exportReportsToCSV }; // Ensure exportReportsToCSV is included