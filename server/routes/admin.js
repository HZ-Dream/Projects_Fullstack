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
router.post('/uploadImage', upload.single('imageAvatarAdmin'), AdminController.uploadImage);

router.post('/signIn', AdminController.signIn);

router.get('/getTotalData', AdminController.getTotalData);
router.get('/getDashboardChart', AdminController.getDashboardChart);

router.get('/getAccount', AdminController.getAccount);
router.get('/getInfo/:adminId', AdminController.getInfo);
router.post('/createAccount', AdminController.createAccount);
router.put('/changeProfile/:adminId', AdminController.changeProfile);
router.put('/changePassword/:adminId', AdminController.changePassword);

module.exports = router;
