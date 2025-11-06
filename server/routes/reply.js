const express = require('express');
const router = express.Router();
const ReplyController = require('../controllers/ReplyController');

router.post('/submitReply', ReplyController.submitReply);
router.delete('/deleteReply/:id', ReplyController.deleteReply);

module.exports = router;
