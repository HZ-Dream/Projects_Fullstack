const Quiz = require('../models/Quiz');
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const secretKey = process.env.AES_SECRET_KEY;

const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

function encryptWithAES(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function decryptWithAES(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

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
            const result = await cloudinary.uploader.remove_tag('temp_upload_quiz', publicIds);

            console.log('--- Đã gỡ tag temp_upload_quiz cho các ảnh:', publicIds);
            console.log('--- Kết quả từ Cloudinary:', result);
        } catch (e) {
            console.error('Lỗi khi gỡ tag trên Cloudinary:', e);
        }
    }
};

class QuizController {
    // [POST] /quiz/uploadImage
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

            const result = await cloudinary.uploader.upload(imageFile.path, { ...options, tags: ['temp_upload_quiz'] });

            fs.unlinkSync(req.file.path);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /quiz/getAllQuizzes
    async getAllQuizzes(req, res) {
        try {
            const quizzes = await Quiz.find().populate('field');

            res.status(200).json(quizzes);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /quiz/quizList?page=num
    async getQuizList(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        const { field, most, sort } = req.query;

        try {
            const query = {};

            // Filter by field
            if (field) {
                const fieldArray = field.split(',').map((id) => id.trim());
                query.field = { $in: fieldArray };
            }

            // Sort
            let listSort = {};
            if (most === 'rated') {
                listSort = { rate: -1 };
            }

            if (sort === 'latest') {
                listSort = { updatedAt: -1 };
            } else if (sort === 'oldest') {
                listSort = { updatedAt: 1 };
            } else if (sort === 'rate_low') {
                listSort = { rate: 1 };
            } else if (sort === 'rate_high') {
                listSort = { rate: -1 };
            }

            const totalQuizzes = await Quiz.countDocuments(query);

            const quizzes = await Quiz.find(query).populate('field').sort(listSort).skip(skip).limit(limit);

            res.status(200).json({
                quizzes,
                totalPages: Math.ceil(totalQuizzes / limit),
                currentPage: page,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /quiz/getQuizDashboard?page=num
    async getQuizListAdmin(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        try {
            const totalQuizzes = await Quiz.countDocuments();

            const quizzes = await Quiz.find().populate('field').skip(skip).limit(limit);
            res.status(200).json({
                quizzes,
                totalPages: Math.ceil(totalQuizzes / limit),
                currentPage: page,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /quiz/getQuizListApprove?page=num
    async getQuizListApprove(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        try {
            const totalQuizzes = await Quiz.countDocuments({ status: '0' });

            const quizzes = await Quiz.find({ status: '0' }).populate('field').skip(skip).limit(limit);
            res.status(200).json({
                quizzes,
                totalPages: Math.ceil(totalQuizzes / limit),
                currentPage: page,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /quiz/approveQuiz/:quizId
    async approveQuiz(req, res) {
        const quizId = req.params.quizId;

        try {
            const status = Number(req.body.status);
            const { adminId } = req.body;

            const quizData = await Quiz.findById(quizId);
            if (!quizData) {
                return res.status(404).json({ msg: 'Quiz not found!' });
            }

            const isCountedStatus = (s) => s === 1 || s === 2;

            const oldCounted = isCountedStatus(Number(quizData.status));
            const newCounted = isCountedStatus(status);

            await Quiz.findByIdAndUpdate(quizId, {
                status,
                approveQuizBy: adminId,
            });

            if (oldCounted !== newCounted) {
                await User.findByIdAndUpdate(quizData.userId, {
                    $inc: { quizCreated: newCounted ? 1 : -1 },
                });
            }

            res.status(200).json({ msg: 'Approve quiz successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /quiz/getQuizDashboard/:userId
    async getQuizDashboard(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        const { userId, field, level } = req.query;

        try {
            const query = {};
            // Filter by userId
            if (userId) {
                query.userId = userId;
            }

            // Filter by field
            if (field) {
                query.field = field;
            }

            // Filter by level
            if (level) {
                query.level = level;
            }

            const totalQuizzes = await Quiz.countDocuments(query);

            const quizzes = await Quiz.find(query).populate('field').skip(skip).limit(limit);

            res.status(200).json({
                quizzes,
                totalPages: Math.ceil(totalQuizzes / limit),
                currentPage: page,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /quiz/getQuiz/:userId
    async getQuiz(req, res) {
        const userId = req.params.userId;

        try {
            const quizzes = await Quiz.find({ userId }).populate('field');

            res.status(200).json(quizzes);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /quiz/getQuizDetail/:quizId
    async getQuizDetail(req, res) {
        const quizId = req.params.quizId;

        try {
            const temp = await Quiz.findById(quizId);
            if (!temp) {
                return res.status(404).json({ msg: 'Quiz not found!' });
            }

            let decryptedPassword = '';
            if (temp.password && temp.password.trim() !== '') {
                try {
                    decryptedPassword = decryptWithAES(temp.password);
                } catch (err) {
                    console.log('Decryption failed:', err);
                }
            }

            res.status(200).json({
                ...temp._doc,
                password: decryptedPassword,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /quiz/createQuiz
    async createQuiz(req, res) {
        const { image, title, description, field, level, duration, password, quiz, userId } = req.body;

        try {
            let encryptedPassword = '';
            if (password) {
                try {
                    encryptedPassword = encryptWithAES(password);
                } catch (err) {
                    console.log('Encryption failed:', err);
                }
            }

            const newQuiz = new Quiz({
                image,
                title,
                description,
                field,
                level,
                duration,
                password: encryptedPassword,
                userId,
                quiz,
            });

            const savedQuiz = await newQuiz.save();

            const imagesToConfirm = [];
            if (image) imagesToConfirm.push(image);

            if (quiz && quiz.length > 0) {
                quiz.forEach((item) => {
                    if (item.questionImage) {
                        imagesToConfirm.push(item.questionImage);
                    }
                });
            }

            if (imagesToConfirm.length > 0) {
                await confirmImages(imagesToConfirm);
            }

            res.status(200).json({
                success: true,
                message: 'Quiz created successfully!',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /quiz/updateQuiz/:quizId
    async updateQuiz(req, res) {
        const quizId = req.params.quizId;
        const { image, title, description, field, level, duration, password, quiz } = req.body;

        try {
            const oldQuiz = await Quiz.findById(quizId);
            if (!oldQuiz) return res.status(404).json({ msg: 'Quiz not found!' });

            if (oldQuiz.image && oldQuiz.image !== image) {
                await deleteImageByUrl(oldQuiz.image);
            }

            const oldQImages = oldQuiz.quiz.map((q) => q.questionImage).filter((img) => img);
            const newQImages = quiz.map((q) => q.questionImage).filter((img) => img);

            for (const oldImg of oldQImages) {
                if (!newQImages.includes(oldImg)) {
                    await deleteImageByUrl(oldImg);
                }
            }

            const imagesToConfirm = [];
            if (image) imagesToConfirm.push(image);
            newQImages.forEach((img) => imagesToConfirm.push(img));

            if (imagesToConfirm.length > 0) {
                await confirmImages(imagesToConfirm);
            }

            let encryptedPassword = password ? encryptWithAES(password) : '';

            const updatedQuiz = await Quiz.findByIdAndUpdate(
                quizId,
                {
                    image,
                    title,
                    description,
                    field,
                    level,
                    duration,
                    password: encryptedPassword,
                    status: '0',
                    quiz,
                },
                { new: true },
            );

            res.status(200).json({ msg: 'Quiz updated successfully!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Server Error!' });
        }
    }

    // [DELETE] /quiz/deleteQuiz/:quizId
    async deleteQuiz(req, res) {
        const quizId = req.params.quizId;
        try {
            const quizData = await Quiz.findById(quizId);
            if (quizData) {
                await deleteImageByUrl(quizData.image);
                for (const q of quizData.quiz) {
                    if (q.questionImage) await deleteImageByUrl(q.questionImage);
                }
            }
            await Quiz.findByIdAndDelete(quizId);
            res.status(200).json({ msg: 'Quiz deleted successfully!' });
        } catch (error) {
            res.status(500).json({ msg: 'Server Error!' });
        }
    }
}

module.exports = new QuizController();
