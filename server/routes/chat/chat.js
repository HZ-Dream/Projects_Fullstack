const express = require('express');
const router = express.Router();
const ChatController = require('../../controllers/chat/ChatController');

router.post('/accessChat', ChatController.accessChat);
router.get('/fetchChat/:myId', ChatController.fetchChat);
router.post('/createGroup', ChatController.createGroup);
router.put('/renameGroup', ChatController.renameGroup);
router.put('/addToGroup', ChatController.addToGroup);
router.put('/removeFromGroup', ChatController.removeFromGroup);

module.exports = router;
