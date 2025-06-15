const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

const filePath = path.join(__dirname, '../logs/student_report.csv');

// Ensure folder exists
fs.mkdirSync(path.dirname(filePath), { recursive: true });

const csvWriter = createObjectCsvWriter({
  path: filePath,
  header: [
    { id: 'timestamp', title: 'Timestamp' },
    { id: 'studentId', title: 'Student ID' },
    { id: 'status', title: 'Status' }
  ],
  append: true
});

async function saveReport(data) {
  await csvWriter.writeRecords([data]);
}

function readReports() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  const rows = data.trim().split('\n').slice(1); // remove header
  return rows.map(row => {
    const [timestamp, studentId, status] = row.split(',');
    return { timestamp, studentId, status };
  });
}

module.exports = { saveReport, readReports };
