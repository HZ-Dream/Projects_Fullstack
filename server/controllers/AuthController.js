const Auth = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

class AuthController {
    // [POST] /auth/uploadAvatar
    async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: true, msg: 'No file uploaded!' });
            }

            const imageFile = req.file;

            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };

            const result = await cloudinary.uploader.upload(imageFile.path, options);

            fs.unlinkSync(req.file.path);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /auth/replaceAvatar/:userId
    async replaceAvatar(req, res) {
        try {
            const userId = req.params.userId;

            if (!req.file) {
                return res.status(400).json({ error: true, msg: 'No file uploaded!' });
            }

            const user = await Auth.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: 'User not found!' });
            }

            if (user.image && user.image !== '') {
                try {
                    const parts = user.image.split('/');
                    const fileName = parts[parts.length - 1];
                    const publicId = fileName.split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (e) {
                    console.error('Error destroying old image: ', e);
                }
            }

            const imageFile = req.file;

            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: true,
            };

            const result = await cloudinary.uploader.upload(imageFile.path, options);

            fs.unlinkSync(req.file.path);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /auth/signUp
    async signUp(req, res) {
        const { name, email, phone, password, isAdmin } = req.body;

        try {
            const existingUser = await Auth.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: true, msg: 'Email already exists!' });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const user = new Auth({
                name,
                email,
                phone,
                password: hashPassword,
                isAdmin: isAdmin || false,
            });

            await user.save();

            const token = jwt.sign({ email: user.email, id: user._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

            res.status(200).json({
                success: true,
                message: 'User created successfully!',
                token,
                error: false,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /auth/signIn
    async signIn(req, res) {
        const { email, password } = req.body;

        try {
            const existingUser = await Auth.findOne({ email: email });

            if (!existingUser) {
                res.status(400).json({ msg: 'User not found!' });
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
    }

    // [GET] /auth/getUser/:userId
    async getUser(req, res) {
        const userId = req.params.userId;
        try {
            const user = await Auth.findById(userId);
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /auth/updateUser/:userId
    async updateUser(req, res) {
        const userId = req.params.userId;
        const { name, email, phone, image } = req.body;
        try {
            const user = await Auth.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: 'User not found!' });
            }

            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;
            user.image = image || user.image;
            await user.save();

            res.status(200).json({ msg: 'User updated successfully!', user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /auth/updatePassword/:userId
    async updatePassword(req, res) {
        const userId = req.params.userId;
        const { oldPassword, newPassword } = req.body;
        try {
            const user = await Auth.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: 'User not found!' });
            }

            const matchPassword = await bcrypt.compare(oldPassword, user.password);

            if (!matchPassword) {
                return res.status(400).json({ msg: 'Old password is incorrect!' });
            }

            const hashNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashNewPassword;
            await user.save();
            res.status(200).json({ msg: 'Password updated successfully!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new AuthController();
