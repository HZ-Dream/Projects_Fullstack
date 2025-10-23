const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Upload Avatar
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/users');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Routers for AuthController
router.post('/uploadAvatar', upload.single('file'), AuthController.uploadAvatar);
router.post('/replaceAvatar/:userId', upload.single('file'), AuthController.replaceAvatar);

router.post('/signUp', AuthController.signUp);
router.post('/signIn', AuthController.signIn);

router.get('/getUser/:userId', AuthController.getUser);
router.put('/updateUser/:userId', AuthController.updateUser);
router.put('/updatePassword/:userId', AuthController.updatePassword);

module.exports = router;
