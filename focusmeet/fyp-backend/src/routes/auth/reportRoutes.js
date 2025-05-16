const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/reportController'); // Import the entire controller object

router.post('/submit', reportController.handleReport);
router.get('/all', reportController.getReport);
router.get('/export/csv', reportController.exportReportsToCSV);

module.exports = router;