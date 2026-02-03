const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

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

// Routers for UserController
router.post('/uploadAvatar', upload.single('file'), UserController.uploadAvatar);
router.post('/replaceAvatar/:userId', upload.single('file'), UserController.replaceAvatar);

router.post('/signUp', UserController.signUp);
router.post('/signIn', UserController.signIn);

router.get('/getAllUser', UserController.getAllUser);
router.get('/getAccount', UserController.getAccount);
router.get('/getUser/:userId', UserController.getUser);
router.put('/updateUser/:userId', UserController.updateUser);
router.put('/updatePassword/:userId', UserController.updatePassword);

router.get('/getUserWishlist/:userId', UserController.getUserWishlist);
router.post('/addToWishlist', UserController.addToWishlist);

module.exports = router;
