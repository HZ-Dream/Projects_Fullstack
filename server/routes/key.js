const express = require('express');
const router = express.Router();
const KeyController = require('../controllers/KeyController');

router.get('/checkContent', KeyController.checkContent);
router.post('/checkText', KeyController.checkText);

router.get('/all', KeyController.all);
router.get('/list', KeyController.list);
router.get('/getItem/:id', KeyController.getItem);
router.post('/createKey', KeyController.createKey);
router.put('/updateKey/:editId', KeyController.updateKey);
router.delete('/deleteKey/:deleteId', KeyController.deleteKey);

module.exports = router;
