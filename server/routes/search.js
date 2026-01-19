const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');

router.get('/recommendQuiz', SearchController.recommendQuiz);
router.get('/findQuiz', SearchController.findQuiz);

module.exports = router;
