const express = require('express');
const router = express.Router();
const GeminiController = require('../controllers/GeminiController');

// Routers for GeminiController
router.post('/generate', GeminiController.generate);
router.post('/convertText', GeminiController.convertText);

module.exports = router;
