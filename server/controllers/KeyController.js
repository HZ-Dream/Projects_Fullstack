const Key = require('../models/Key');
const Quiz = require('../models/Quiz');
const { checkQuizContent } = require('../utils/checkContent');

class KeyController {
    // [GET] /key/checkContent
    async checkContent(req, res) {
        try {
            const quizzes = await Quiz.find({ status: '0' });
            const keys = await Key.find();

            let result = [];

            quizzes.forEach((quiz) => {
                const violations = checkQuizContent(quiz, keys);

                if (violations.length > 0) {
                    result.push({
                        quizId: quiz._id,
                        title: quiz.title,
                        violations,
                    });
                }
            });

            return res.json({
                isValid: result.length === 0,
                data: result,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /key/checkText
    async checkText(req, res) {
        try {
            const { text } = req.body;

            if (!text) {
                return res.status(400).json({ msg: 'Text is required' });
            }

            const quizzes = await Quiz.find({ status: '0' });

            const keyword = text.toLowerCase();

            let result = [];

            quizzes.forEach((quiz) => {
                let found = false;

                // title + description
                if (quiz.title.toLowerCase().includes(keyword) || quiz.description.toLowerCase().includes(keyword)) {
                    found = true;
                }

                // questions
                quiz.quiz.forEach((q) => {
                    if (
                        q.questionText.toLowerCase().includes(keyword) ||
                        q.options.some((opt) => opt.toLowerCase().includes(keyword)) ||
                        q.correctAnswers.some((ans) => ans.toLowerCase().includes(keyword))
                    ) {
                        found = true;
                    }
                });

                if (found) {
                    result.push({
                        quizId: quiz._id,
                        title: quiz.title,
                        matchedText: text,
                    });
                }
            });

            return res.json({
                isValid: result.length === 0,
                data: result,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /key/all
    async all(req, res) {
        try {
            const keyList = await Key.find();

            if (!keyList) {
                res.status(500).json({ success: false });
                return;
            }

            res.status(200).json({
                keyList,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /key/list?page=N*
    async list(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 5;
            const totalKeys = await Key.countDocuments();
            const totalPages = Math.ceil(totalKeys / perPage);

            if (page < 1 || page > totalPages) {
                return res.status(400).json({
                    message: 'Page not found!',
                });
            }

            const keyList = await Key.find()
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();

            if (!keyList) {
                res.status(500).json({ success: false });
            }

            res.status(200).json({
                keyList,
                totalPages,
                totalKeys,
                page,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /key/getItem/:id
    async getItem(req, res) {
        const id = req.params.id;
        try {
            const key = await Key.findById(id);

            res.status(200).json(key);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /key/createKey
    async createKey(req, res) {
        try {
            const { name } = req.body;

            const exitName = await Key.findOne({ name });

            if (exitName) {
                res.status(400).json({ msg: 'Name of Key already exits!' });
                return;
            }

            const newKey = new Key({
                name,
            });

            await newKey.save();

            res.status(200).json({
                success: true,
                msg: 'Key created successfully!',
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /key/updateKey/:editId
    async updateKey(req, res) {
        const id = req.params.editId;

        try {
            const { name } = req.body;

            const exitKey = await Key.findById(id);

            if (!exitKey) {
                res.status(400).json({ msg: 'Key not found!' });
                return;
            }

            const exitName = await Key.findOne({ name });

            if (exitName) {
                res.status(400).json({ msg: 'Name of Key already exits!' });
                return;
            }

            const updateKey = await Key.findByIdAndUpdate(
                id,
                {
                    name,
                },
                {
                    new: true,
                },
            );

            if (!updateKey) {
                return res.status(404).json({ msg: 'Can not update!' });
            }

            res.status(200).json({ msg: 'Key updated successfully!' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [DELETE] /key/deleteKey/:deleteId
    async deleteKey(req, res) {
        const id = req.params.deleteId;
        try {
            await Key.findByIdAndDelete(id);
            res.status(200).json({ msg: 'Key deleted successfully!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new KeyController();
