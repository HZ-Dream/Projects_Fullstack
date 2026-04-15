const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');

router.get('/reportList', ReportController.reportList);
router.get('/reportByUser/:userId', ReportController.reportByUser);
router.post('/create', ReportController.createReport);
router.put('/approve/:reportId', ReportController.approveReport);
router.delete('/delete/:reportId', ReportController.deleteReport);

module.exports = router;
