const express = require('express');
const router = express.Router();
const MessageController = require('../../controllers/chat/MessageController');

router.get('/allMessages/:chatId', MessageController.allMessages);
router.post('/sendMessage', MessageController.sendMessage);

module.exports = router;
