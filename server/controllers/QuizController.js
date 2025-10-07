const Quiz = require('../models/Quiz');
const bcrypt = require('bcrypt');

class QuizController {
    // [POST] /quiz/createQuiz
    async createQuiz(req, res) {
        const { image, title, description, field, level, duration, password, quiz, userId } = req.body;
        try {
            let status = 2;
            let hashPassword = '';
            if (password !== '' || password !== null) {
                status = 1;
                hashPassword = await bcrypt.hash(password, 10);
            }

            const q = new Quiz({
                image,
                title,
                description,
                field,
                level,
                duration,
                password: hashPassword,
                status: status,
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
}

module.exports = new QuizController();
