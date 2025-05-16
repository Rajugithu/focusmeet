const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'attention_logs.csv');

/**
 * Ensures the log directory and CSV file with header exist.
 */
function ensureLogFile() {
  // Create log directory if it doesn't exist
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  // Create CSV file with header if it doesn't exist
  if (!fs.existsSync(LOG_FILE)) {
    const header = 'userId,name,meetingId,isAttentive,timestamp\n';
    fs.writeFileSync(LOG_FILE, header);
  }
}

/**
 * Logs an attention record to the CSV file.
 * @param {Object} data - Contains userId, name, meetingId, isAttentive, timestamp.
 */
function logAttention({ userId, name, meetingId, isAttentive, timestamp }) {
  ensureLogFile();
  // Append a new row to the CSV
  const row = `${userId},${name},${meetingId},${isAttentive},${timestamp}\n`;
  fs.appendFile(LOG_FILE, row, (err) => {
    if (err) {
      console.error('Error writing attention log:', err);
    }
  });
}

module.exports = { logAttention };
