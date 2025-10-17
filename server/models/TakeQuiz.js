const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Question
const QuestionSchema = new Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    yourAnswers: [{ type: String, required: true }],
    correctAnswers: [{ type: String, required: true }],
});

// Take Quiz
const TakeQuizSchema = new Schema(
    {
        quizId: { type: String, required: true },
        userId: { type: String, required: true },
        correct: { type: Number, required: true },
        incorrect: { type: Number, required: true },
        skip: { type: Number, required: true },
        score: { type: String, required: true },
        duration: { type: Number, required: true },
        quiz: { type: [QuestionSchema], required: true },
    },
    { timestamps: true },
);

TakeQuizSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

TakeQuizSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('take_quizzes', TakeQuizSchema);
