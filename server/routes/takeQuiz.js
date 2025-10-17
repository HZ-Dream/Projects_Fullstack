const express = require('express');
const router = express.Router();
const TakeQuizController = require('../controllers/TakeQuizController');

router.post('/checkPassword/:quizId', TakeQuizController.checkPassword);
router.post('/submitQuiz', TakeQuizController.submitQuiz);
router.post('/getTakenQuiz/:quizId', TakeQuizController.getTakenQuiz);

module.exports = router;
