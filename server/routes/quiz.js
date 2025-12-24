const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');

router.get('/getAllQuizzes', QuizController.getAllQuizzes);
router.get('/quizList', QuizController.getQuizList);
router.get('/getQuiz/:userId', QuizController.getQuiz);
router.get('/getQuizDetail/:quizId', QuizController.getQuizDetail);
router.post('/createQuiz', QuizController.createQuiz);
router.put('/updateQuiz/:quizId', QuizController.updateQuiz);
router.delete('/deleteQuiz/:quizId', QuizController.deleteQuiz);

module.exports = router;
