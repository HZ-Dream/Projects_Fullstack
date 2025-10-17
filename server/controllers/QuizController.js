const Quiz = require('../models/Quiz');
const CryptoJS = require('crypto-js');
const secretKey = process.env.AES_SECRET_KEY;

function encryptWithAES(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function decryptWithAES(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

class QuizController {
    // [GET] /quiz/getAllQuizzes
    async getAllQuizzes(req, res) {
        try {
            const quizzes = await Quiz.find();

            res.status(200).json(quizzes);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /quiz/getQuiz/:userId
    async getQuiz(req, res) {
        const userId = req.params.userId;

        try {
            const quizzes = await Quiz.find({ userId });

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
            let status = password && password.trim() !== '' ? 1 : 2;
            let encryptedPassword = '';
            try {
                encryptedPassword = encryptWithAES(password);
            } catch (err) {
                console.log('Encryption failed:', err);
            }

            const q = new Quiz({
                image,
                title,
                description,
                field,
                level,
                duration,
                password: encryptedPassword,
                status,
                userId,
                quiz,
            });

            await q.save();

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
            let status = password && password.trim() !== '' ? 1 : 2;
            let encryptedPassword = '';
            try {
                encryptedPassword = encryptWithAES(password);
            } catch (err) {
                console.log('Encryption failed:', err);
            }

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
                    status: status,
                    quiz,
                },
                { new: true },
            );

            if (!updatedQuiz) {
                return res.status(404).json({ msg: 'Quiz not found!' });
            }
            res.status(200).json({ msg: 'Quiz updated successfully!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [DELETE] /quiz/deleteQuiz/:quizId
    async deleteQuiz(req, res) {
        const quizId = req.params.quizId;
        try {
            await Quiz.findByIdAndDelete(quizId);
            res.status(200).json({ msg: 'Quiz deleted successfully!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new QuizController();
