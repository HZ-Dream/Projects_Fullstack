const express = require('express');
const router = express.Router();
const payVNPay = require('../middleware/VNPay/payVNPay');

router.post('/create', payVNPay.create);
router.get('/return', payVNPay.return);

module.exports = router;
