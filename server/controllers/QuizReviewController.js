const QuizReview = require('../models/QuizReview');
const Reply = require('../models/Reply');

async function deleteRepliesRecursively(parentId) {
    const replies = await Reply.find({ parentReplyId: parentId });
    for (const reply of replies) {
        await deleteRepliesRecursively(reply._id);
        await Reply.findByIdAndDelete(reply._id);
    }
}

class QuizReviewController {
    // [GET] /quizReview/getReviews/:quizId
    async getReviews(req, res) {
        try {
            const { quizId } = req.params;

            const reviews = await QuizReview.find({ quizId }).sort({ createdAt: -1 }).lean();

            const replies = await Reply.find({ reviewId: quizId }).sort({ createdAt: 1 }).lean();

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
            const { quizId, userId, userName, userImage, review, rating } = req.body;

            const newReview = new QuizReview({
                quizId,
                userId,
                userName,
                userImage,
                review,
                rating,
            });

            const savedReview = await newReview.save();

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
