const express = require('express');
const router = express.Router();
const GeminiController = require('../controllers/GeminiController');

router.post('/generate', GeminiController.generate);

module.exports = router;
