const express = require('express');
const router = express.Router();
const FieldController = require('../controllers/FieldController');

router.get('/all', FieldController.all);
router.get('/list', FieldController.list);
router.get('/getItem/:id', FieldController.getItem);
router.post('/createField', FieldController.createField);
router.put('/updateField/:editId', FieldController.updateField);
router.delete('/deleteField/:deleteId', FieldController.deleteField);

module.exports = router;
