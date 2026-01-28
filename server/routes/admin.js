const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

// Upload Avatar
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/admins');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Routers for AdminController
//router.post('/uploadAvatar', upload.single('file'), AdminController.uploadAvatar);
//router.post('/replaceAvatar/:adminId', upload.single('file'), AdminController.replaceAvatar);

router.post('/signUp', AdminController.signUp);
router.post('/signIn', AdminController.signIn);

router.get('/getAccount', AdminController.getAccount);
//router.put('/updateInfo/:adminId', AdminController.updateUser);
//router.put('/updatePassword/:adminId', AdminController.updatePassword);

module.exports = router;
