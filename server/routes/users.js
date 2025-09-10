const { User } = require('../models/user');
const { ImageUpload } = require('../models/imageUpload');
const { sendEmail } = require('../utils/emailService');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

let pLimit;
(async () => {
    pLimit = (await import('p-limit')).default;
})();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/users');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Add new image upload route
router.post(
    '/upload',
    upload.array('images', 1), // Max 1
    async (req, res) => {
        try {
            const imagesArr = [];

            for (const file of req.files) {
                const options = {
                    use_filename: true,
                    unique_filename: false,
                    overwrite: false,
                };

                const result = await cloudinary.uploader.upload(file.path, options);
                imagesArr.push(result.secure_url);

                fs.unlinkSync(file.path);
            }

            const imagesUploaded = new ImageUpload({ images: imagesArr });
            await imagesUploaded.save();

            return res.status(200).json(imagesArr);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Upload failed' });
        }
    },
);

// Replace Image
router.post(
    '/:id/upload',
    upload.array('images', 1), // Max 1
    async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    message: 'Category not found!',
                    success: false,
                });
            }

            // Delete Image in Cloudinary
            if (user.images.length > 0) {
                for (const imageUrl of user.images) {
                    // example: https://res.cloudinary.com/<cloud_name>/image/upload/v1690000000/filename.jpg
                    const parts = imageUrl.split('/');
                    const filename = parts[parts.length - 1];
                    const publicId = filename.split('.')[0];

                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Delete Image in ImageUpload
            await ImageUpload.deleteMany({ images: { $in: category.images } });

            const imagesArr = [];

            for (const file of req.files) {
                const options = {
                    use_filename: true,
                    unique_filename: false,
                    overwrite: false,
                };

                const result = await cloudinary.uploader.upload(file.path, options);
                imagesArr.push(result.secure_url);

                fs.unlinkSync(file.path);
            }

            const imagesUploaded = new ImageUpload({ images: imagesArr });
            await imagesUploaded.save();

            return res.status(200).json(imagesArr);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Upload failed' });
        }
    },
);

router.post('/authWithGoogle', async (req, res) => {
    const { name, email, password, image, phone } = req.body;
    try {
        let existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            const hashPassword = await bcrypt.hash(password, 10);

            const result = await User.create({
                name: name,
                phone: phone,
                email: email,
                password: hashPassword,
                image: image,
                isAdmin: false,
                isVerified: true,
                otp: null,
                otpExpires: null,
            });
            const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);
            res.status(200).json({
                user: result,
                token: token,
                error: false,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong!' });
    }
});

const sendEmailFunc = async (to, subject, text, html) => {
    const result = await sendEmail(to, subject, text, html);
    if (result.success) {
        return true;
    } else {
        return false;
    }
};

router.post('/verifyemail', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(400).json({ error: true, msg: 'User not found!' });
            return;
        }

        const isCodeValid = user.otp === otp;
        const isNotExpired = user.otpExpires > Date.now();

        if (isCodeValid && isNotExpired) {
            user.isVerified = true;
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            res.status(200).json({ success: true, msg: 'Email verified successfully!' });
        } else if (!isCodeValid) {
            res.status(400).json({ error: true, msg: 'Invalid verification code!' });
        } else if (!isNotExpired) {
            res.status(400).json({ error: true, msg: 'Verification code has expired!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong!' });
    }
});

router.post('/signUp', async (req, res) => {
    const { name, phone, email, password, isAdmin } = req.body;

    try {
        const veryfyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: true, msg: 'Email already exists!' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            phone,
            email,
            password: hashPassword,
            isAdmin: isAdmin || false,
            otp: veryfyCode,
            otpExpires: Date.now() + 600000, // 10'
        });

        await user.save();

        const emailSent = await sendEmailFunc(email, 'Verify Mail', '', 'Your otp code is ' + veryfyCode);
        if (!emailSent) {
            return res.status(500).json({ msg: 'Could not send verification email' });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).json({
            success: true,
            message: 'User created successfully! Please verify your email.',
            token,
            error: false,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong!' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            res.status(400).json({ msg: 'User not found!' });
            return;
        }

        if (!existingUser.isVerified) {
            res.status(400).json({ msg: 'Your email is not verified. Please verify your email to sign in.' });
            return;
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            res.status(400).json({ msg: 'Wrong password. Try again or click forgot password to reset it!' });
            return;
        }

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY,
        );

        res.status(200).json({
            user: existingUser,
            token: token,
            msg: 'User Authenticated',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong!' });
    }
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(500).json({ message: 'The user with the given ID was not found.' });
    }
    res.status(200).send(user);
});

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((user) => {
            if (user) {
                return res.status(200).json({ success: true, message: 'The user is deleted!' });
            } else {
                return res.status(404).json({ success: false, message: 'User not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        res.send({ userCount });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.put('/password/:id', async (req, res) => {
    const { password, newPassword } = req.body;
    console.log('req.body:', req.body);

    try {
        const userExit = await User.findById(req.params.id);
        if (!userExit) {
            return res.status(400).json({ msg: 'User not found!' });
        }

        const matchPassword = await bcrypt.compare(password, userExit.password);
        if (!matchPassword) {
            return res.status(400).json({ msg: 'Wrong password. Try again or click forgot password to reset it!' });
        }

        let updatePassword;
        if (newPassword) {
            updatePassword = await bcrypt.hash(newPassword, 10);
        } else {
            updatePassword = userExit.password;
        }

        console.log('updatePassword:', updatePassword);

        const user = await User.findByIdAndUpdate(req.params.id, { password: updatePassword }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Password can not be updated!' });
        }

        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Something went wrong!' });
    }
});

router.put('/:id', async (req, res) => {
    const { name, phone, email, image } = req.body;

    try {
        const userExit = await User.findById(req.params.id);

        if (userExit) {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    name: name,
                    phone: phone,
                    email: email,
                    image: image,
                },
                { new: true },
            );

            if (!user) {
                return res.status(404).json({ success: false, message: 'User can not be updated!' });
            }

            res.send(user);
        } else {
            res.status(404).json({ success: false, message: 'User not found!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
});

module.exports = router;
