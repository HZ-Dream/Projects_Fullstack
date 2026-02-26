const User = require('../models/User');
const Quiz = require('../models/Quiz');
const TakeQuiz = require('../models/TakeQuiz');
const QuizReview = require('../models/QuizReview');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('res.cloudinary.com')) return null;

    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/public_id.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;

    let remainingParts = parts.slice(uploadIndex + 1);

    if (remainingParts[0].startsWith('v') && !isNaN(remainingParts[0].substring(1))) {
        remainingParts.shift();
    }

    const lastPart = remainingParts.pop();
    const fileName = lastPart.split('.')[0];
    remainingParts.push(fileName);

    return remainingParts.join('/');
};

const deleteImageByUrl = async (imageUrl) => {
    const publicId = getPublicIdFromUrl(imageUrl);
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (e) {
        console.error('Lỗi xóa ảnh Cloudinary:', e);
    }
};

const confirmImages = async (urls) => {
    const publicIds = urls.map((url) => getPublicIdFromUrl(url)).filter((id) => id !== null);

    if (publicIds.length > 0) {
        try {
            const result = await cloudinary.uploader.remove_tag('temp_upload_avatar_user', publicIds);
        } catch (e) {
            console.error('Lỗi khi gỡ tag trên Cloudinary:', e);
        }
    }
};

const fillMissingMonths = (quizData, attemptData, rateData, months) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;

    const monthList = [];
    for (let i = months - 1; i >= 0; i--) {
        let m = currentMonth - i;
        if (m <= 0) m += 12;
        monthList.push(m);
    }

    const mapQuiz = Object.fromEntries(quizData.map((i) => [i._id, i.totalQuiz]));

    const mapAttempt = Object.fromEntries(attemptData.map((i) => [i._id, i.totalAttempts]));

    const mapRate = Object.fromEntries(rateData.map((i) => [i._id, i.totalRates]));

    return {
        quizzes: monthList.map((m) => mapQuiz[m] || 0),
        attempts: monthList.map((m) => mapAttempt[m] || 0),
        rates: monthList.map((m) => mapRate[m] || 0),
    };
};

class UserController {
    // [POST] /user/uploadImage
    async uploadImage(req, res) {
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

            const result = await cloudinary.uploader.upload(imageFile.path, {
                ...options,
                tags: ['temp_upload_avatar_user'],
            });

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

    // [GET] /user/getTotalData/:userId
    async getTotalData(req, res) {
        const userId = req.params.userId;
        try {
            const quizzes = await Quiz.find({ userId });

            const totalAttempts = quizzes.reduce((total, quiz) => total + quiz.attempts, 0);

            const totalRates = quizzes.reduce((total, quiz) => total + quiz.totalRate, 0);

            res.status(200).json({ totalQuiz: quizzes.length, totalAttempts, totalRates });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /user/getDashboardChart/:userId?months=number
    async getDashboardChart(req, res) {
        try {
            const { userId } = req.params;
            const months = Number(req.query.months) || 3;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid userId' });
            }

            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

            const userQuizzes = await Quiz.find({ userId }, { _id: 1 }).lean();

            const quizIds = userQuizzes.map((q) => q._id.toString());

            const quizStats = await Quiz.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        createdAt: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        totalQuiz: { $sum: 1 },
                    },
                },
            ]);

            const attemptStats = await TakeQuiz.aggregate([
                {
                    $match: {
                        quizId: { $in: quizIds },
                        createdAt: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        totalAttempts: { $sum: 1 },
                    },
                },
            ]);

            const rateStats = await QuizReview.aggregate([
                {
                    $match: {
                        quizId: { $in: quizIds },
                        createdAt: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        totalRates: { $sum: 1 },
                    },
                },
            ]);

            const result = fillMissingMonths(quizStats, attemptStats, rateStats, months);

            res.json(result);
        } catch (err) {
            console.error('DashboardChart error:', err);
            res.status(500).json({ message: err.message });
        }
    }

    // [GET] /user/getAllUser
    async getAllUser(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
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

            const oldEmail = user.email;

            if (email !== oldEmail) {
                const existingUser = await User.findOne({ email: email });
                if (existingUser) {
                    res.status(400).json({ msg: 'Email already exists!' });
                    return;
                }
            }

            if (user.image && user.image !== image) {
                await deleteImageByUrl(user.image);
            }

            const imagesToConfirm = [];
            if (image && image.trim() !== '') {
                imagesToConfirm.push(image);
            }

            if (imagesToConfirm.length > 0) {
                await confirmImages(imagesToConfirm);
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
            const user = await User.findById(userId)
                .populate({
                    path: 'wishlist',
                    populate: { path: 'field' },
                })
                .populate({
                    path: 'wishlist',
                    populate: { path: 'userId', select: 'name image' },
                });

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
