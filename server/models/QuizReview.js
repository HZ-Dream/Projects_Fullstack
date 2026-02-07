const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Quiz Review
const QuizReviewSchema = new Schema(
    {
        quizId: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        review: { type: String, required: true },
        rating: { type: Number, required: true },
    },
    { timestamps: true },
);

QuizReviewSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

QuizReviewSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('quiz_reviews', QuizReviewSchema);
