const express = require('express');
const router = express.Router();
const TokenController = require('../controllers/TokenController');

router.get('/all', TokenController.all);
router.get('/list', TokenController.list);
router.get('/getItem/:id', TokenController.getItem);
router.post('/createToken', TokenController.createToken);
router.put('/updateToken/:editId', TokenController.updateToken);
router.delete('/deleteToken/:deleteId', TokenController.deleteToken);

module.exports = router;
