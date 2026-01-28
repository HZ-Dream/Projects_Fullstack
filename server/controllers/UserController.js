const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

class UserController {
    // [POST] /user/uploadAvatar
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

    // [POST] /user/replaceAvatar/:userId
    async replaceAvatar(req, res) {
        try {
            const userId = req.params.userId;

            if (!req.file) {
                return res.status(400).json({ error: true, msg: 'No file uploaded!' });
            }

            const user = await User.findById(userId);
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

    // [POST] /user/signUp
    async signUp(req, res) {
        const { name, email, phone, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: true, msg: 'Email already exists!' });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const user = new User({
                name,
                email,
                phone,
                password: hashPassword,
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

    // [POST] /user/signIn
    async signIn(req, res) {
        const { email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email: email });

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
                msg: 'User Userenticated',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /user/getAccount?page=number
    async getAccount(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        try {
            const totalUsers = await User.countDocuments();
            const totalPages = Math.ceil(totalUsers / limit);
            const users = await User.find().skip(skip).limit(limit);
            res.status(200).json({ users, totalPages, currentPage: page });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /user/getUser/:userId
    async getUser(req, res) {
        const userId = req.params.userId;
        try {
            const user = await User.findById(userId);
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /user/updateUser/:userId
    async updateUser(req, res) {
        const userId = req.params.userId;
        const { name, email, phone, image } = req.body;
        try {
            const user = await User.findById(userId);
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

    // [PUT] /user/updatePassword/:userId
    async updatePassword(req, res) {
        const userId = req.params.userId;
        const { oldPassword, newPassword } = req.body;
        try {
            const user = await User.findById(userId);
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

    // [GET] /user/getUserWishlist/:userId?page=?
    async getUserWishlist(req, res) {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page - 1) * limit;

        try {
            const user = await User.findById(userId).populate('wishlist');
            const totalWishlistItems = user.wishlist.length;
            const totalPages = Math.ceil(totalWishlistItems / limit);
            user.wishlist = user.wishlist.slice(skip, skip + limit);

            if (!user) {
                return res.status(404).json({ msg: 'User not found!' });
            }
            res.status(200).json({ wishlist: user.wishlist, totalPages, currentPage: page });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /user/addToWishlist
    async addToWishlist(req, res) {
        const { userId, quizId } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: 'User not found!' });
            }
            if (user.wishlist.includes(quizId)) {
                user.wishlist = user.wishlist.filter((id) => id.toString() !== quizId);
                await user.save();
                return res
                    .status(200)
                    .json({ msg: 'Quiz removed from wishlist successfully!', wishlist: user.wishlist });
            } else {
                user.wishlist.push(quizId);
                await user.save();
                res.status(200).json({ msg: 'Quiz added to wishlist successfully!', wishlist: user.wishlist });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new UserController();
