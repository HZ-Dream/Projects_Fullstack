const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');

// Upload Images
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/quizzes');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Routers for QuizController
router.post('/uploadImage', upload.single('imageQuiz'), QuizController.uploadImage);

// Dashboard
router.get('/getQuizListAdmin', QuizController.getQuizListAdmin);
router.put('/approveQuiz/:quizId', QuizController.approveQuiz);

router.get('/getAllQuizzes', QuizController.getAllQuizzes);
router.get('/quizList', QuizController.getQuizList);
router.get('/getStats/:userId', QuizController.getStats);
router.get('/getQuizDashboard/:userId', QuizController.getQuizDashboard);
router.get('/getQuiz/:userId', QuizController.getQuiz);
router.get('/getQuizDetail/:quizId', QuizController.getQuizDetail);

router.post('/createQuiz', QuizController.createQuiz);
router.put('/updateQuiz/:quizId', QuizController.updateQuiz);
router.delete('/deleteQuiz/:quizId', QuizController.deleteQuiz);

module.exports = router;
