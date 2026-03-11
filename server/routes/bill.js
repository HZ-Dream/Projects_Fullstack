const express = require('express');
const router = express.Router();
const BillController = require('../controllers/BillController');

router.get('/list', BillController.list);
router.get('/getByUser/:userId', BillController.getByUser);

module.exports = router;
