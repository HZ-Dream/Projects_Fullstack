const TakeQuiz = require('../models/TakeQuiz');
const Quiz = require('../models/Quiz');
const CryptoJS = require('crypto-js');
const secretKey = process.env.AES_SECRET_KEY;

function decryptWithAES(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

class TakeQuizController {
    // [POST] /takeQuiz/checkPassword/:quizId
    async checkPassword(req, res) {
        const id = req.params.quizId;
        const { password } = req.body;

        try {
            const quiz = await Quiz.findById(id);

            let decryptedPassword = '';
            try {
                decryptedPassword = decryptWithAES(quiz.password);
            } catch (err) {
                console.log('Decryption failed:', err);
            }

            if (decryptedPassword !== password) {
                res.status(400).json({ msg: 'Wrong password. Try again or click forgot password to reset it!' });
                return;
            }

            res.status(200).json({ msg: 'Password is correct!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /takeQuiz/submitQuiz
    async submitQuiz(req, res) {
        const { quizId, userId, userAnswers, duration } = req.body;

        try {
            const originalQuiz = await Quiz.findById(quizId);
            if (!originalQuiz) {
                return res.status(404).json({ msg: 'Quiz not found!' });
            }

            let correctCount = 0;
            let incorrectCount = 0;
            let skipCount = 0;
            const detailedResults = [];

            originalQuiz.quiz.forEach((question) => {
                const userAnswer = userAnswers.find((ans) => ans.questionId === question._id.toString());

                const resultQuestion = {
                    questionText: question.questionText,
                    options: question.options,
                    correctAnswers: question.correctAnswers,
                    yourAnswers: [],
                };

                if (!userAnswer || userAnswer.selectedOptions.length === 0) {
                    skipCount++;
                } else {
                    resultQuestion.yourAnswers = userAnswer.selectedOptions;
                    if (areArraysEqual(question.correctAnswers, userAnswer.selectedOptions)) {
                        correctCount++;
                    } else {
                        incorrectCount++;
                    }
                }
                detailedResults.push(resultQuestion);
            });

            const totalQuestions = originalQuiz.quiz.length;
            const score = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) : 0;

            const newTakeQuiz = new TakeQuiz({
                quizId,
                userId,
                correct: correctCount,
                incorrect: incorrectCount,
                skip: skipCount,
                score: `${score}%`,
                duration,
                quiz: detailedResults,
            });

            await newTakeQuiz.save();

            res.status(200).json({
                msg: 'Quiz submitted successfully!',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong on the server!' });
        }
    }

    // [POST] /takeQuiz/getTakenQuiz/:quizId
    async getTakenQuiz(req, res) {
        const quizId = req.params.quizId;
        const { userId } = req.body;

        console.log(quizId, userId);

        if (!userId) {
            return res.status(400).json({ msg: 'User ID is required.' });
        }

        try {
            const takenQuizzes = await TakeQuiz.find({ quizId, userId }).sort({ createdAt: -1 });
            res.status(200).json(takenQuizzes);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong on the server!' });
        }
    }
}

module.exports = new TakeQuizController();
