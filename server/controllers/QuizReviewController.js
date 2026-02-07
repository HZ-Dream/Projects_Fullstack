const QuizReview = require('../models/QuizReview');
const Quiz = require('../models/Quiz');
const Reply = require('../models/Reply');

async function deleteRepliesRecursively(parentId) {
    const replies = await Reply.find({ parentReplyId: parentId });
    for (const reply of replies) {
        await deleteRepliesRecursively(reply._id);
        await Reply.findByIdAndDelete(reply._id);
    }
}

class QuizReviewController {
    // [GET] /quizReview/getRates/:quizId
    async getRates(req, res) {
        try {
            const { quizId } = req.params;
            const reviews = await QuizReview.find({ quizId }).lean();

            if (reviews.length === 0) {
                return res.status(200).json({
                    averageRating: 0,
                    totalReviews: 0,
                    fiveStarCount: 0,
                    fourStarCount: 0,
                    threeStarCount: 0,
                    twoStarCount: 0,
                    oneStarCount: 0,
                });
            }

            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

            const fiveStarCount = reviews.filter((review) => review.rating === 4.5 || review.rating === 5).length;
            const fourStarCount = reviews.filter((review) => review.rating === 3.5 || review.rating === 4).length;
            const threeStarCount = reviews.filter((review) => review.rating === 2.5 || review.rating === 3).length;
            const twoStarCount = reviews.filter((review) => review.rating === 1.5 || review.rating === 2).length;
            const oneStarCount = reviews.filter((review) => review.rating === 0.5 || review.rating === 1).length;

            res.status(200).json({
                averageRating: parseFloat(averageRating.toFixed(2)),
                totalReviews: reviews.length,
                fiveStarCount,
                fourStarCount,
                threeStarCount,
                twoStarCount,
                oneStarCount,
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // [GET] /quizReview/getReviews/:quizId
    async getReviews(req, res) {
        try {
            const { quizId } = req.params;

            const reviews = await QuizReview.find({ quizId }).populate('userId').sort({ createdAt: -1 }).lean();

            const replies = await Reply.find({ reviewId: quizId }).populate('userId').sort({ createdAt: 1 }).lean();

            console.log(replies);

            res.status(200).json({
                reviews,
                replies,
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // [POST] /quizReview/submitReview
    async submitReview(req, res) {
        try {
            const { quizId, userId, review, rating } = req.body;
            const originalQuiz = await Quiz.findById(quizId).lean();
            if (!originalQuiz) {
                return res.status(404).json({ msg: 'Quiz not found!' });
            }

            const existingReview = await QuizReview.findOne({ quizId, userId });
            if (existingReview) {
                return res.status(400).json({ msg: 'You have already submitted a review for this quiz!' });
            }

            const newReview = new QuizReview({
                quizId,
                userId,
                review,
                rating,
            });

            const savedReview = await newReview.save();

            const reviews = await QuizReview.find({ quizId }).lean();

            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

            await Quiz.findByIdAndUpdate(quizId, {
                rate: averageRating.toFixed(1),
                totalRate: reviews.length,
            });

            res.status(201).json({
                msg: 'Review submitted successfully',
                review: savedReview,
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // [DELETE] /quizReview/deleteReview/:id
    async deleteReview(req, res) {
        const id = req.params.id;
        try {
            const deletedReview = await QuizReview.findByIdAndDelete(id);
            const quizId = deletedReview.quizId;

            const reviews = await QuizReview.find({ quizId }).lean();

            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = reviews.length > 0 ? Math.round((totalRating / reviews.length) * 10) / 10 : 0;
            await Quiz.findByIdAndUpdate(quizId, {
                rate: averageRating.toFixed(1),
                totalRate: reviews.length,
            });

            if (!deletedReview) {
                return res.status(404).json({ msg: 'Review not found!' });
            }

            await deleteRepliesRecursively(id);

            res.status(200).json({ msg: 'Review and all replies deleted successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new QuizReviewController();
