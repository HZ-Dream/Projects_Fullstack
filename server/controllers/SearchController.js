const Quiz = require('../models/Quiz');
const mongoose = require('mongoose');

class SearchController {
    // [GET] /api/search/recommendQuiz?q=?
    async recommendQuiz(req, res) {
        try {
            const query = req.query.q;
            console.log('Recommend Query:', query);

            const quizzes = await Quiz.find({
                $or: [
                    { _id: mongoose.Types.ObjectId.isValid(query) ? new mongoose.Types.ObjectId(query) : null },
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                ],
            });

            return res.status(200).json(quizzes);
        } catch (error) {
            console.error('Recommend Controller Error:', error);
            return res.status(500).json({
                msg: 'No recommend quiz!',
                error: error.message,
            });
        }
    }

    // [GET] /api/search/findQuiz?q=?
    async findQuiz(req, res) {
        try {
            const query = req.query.q;

            console.log('Search Query:', query);

            if (!query || query.trim() === '') {
                return res.status(400).json({ msg: 'Query parameter is required.' });
            }

            const quizzes = await Quiz.find({
                $or: [
                    { _id: mongoose.Types.ObjectId.isValid(query) ? new mongoose.Types.ObjectId(query) : null },
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                ],
            });

            return res.status(200).json(quizzes);
        } catch (error) {
            console.error('Search Controller Error:', error);
            return res.status(500).json({
                msg: 'No find quiz!',
                error: error.message,
            });
        }
    }
}

module.exports = new SearchController();
