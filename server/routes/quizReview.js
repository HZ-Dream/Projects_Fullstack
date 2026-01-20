const express = require('express');
const router = express.Router();
const QuizReviewController = require('../controllers/QuizReviewController');

router.get('/getRates/:quizId', QuizReviewController.getRates);
router.get('/getReviews/:quizId', QuizReviewController.getReviews);
router.post('/submitReview', QuizReviewController.submitReview);
router.delete('/deleteReview/:id', QuizReviewController.deleteReview);

module.exports = router;
