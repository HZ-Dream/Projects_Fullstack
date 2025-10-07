const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');

router.post('/createQuiz', QuizController.createQuiz);

module.exports = router;
