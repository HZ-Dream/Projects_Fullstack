const express = require('express');
const router = express.Router();
const SurveyAIController = require('../controllers/SurveyAIController');

// Upload File
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/words');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Routers for SurveyAIController
router.post('/uploadFile', upload.single('wordFile'), SurveyAIController.uploadFile);

router.get('/getList', SurveyAIController.getList);
router.post('/submitSurvey', SurveyAIController.submitSurvey);

module.exports = router;
