const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/signUp', AuthController.signUp);

router.post('/signIn', AuthController.signIn);

module.exports = router;
