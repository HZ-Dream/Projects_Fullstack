const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Question
const QuestionSchema = new Schema({
    questionImage: { type: String, default: '' },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswers: [{ type: String, required: true }],
});

// Quiz
const QuizSchema = new Schema(
    {
        image: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        field: { type: mongoose.Schema.Types.ObjectId, ref: 'fields', required: true },
        rate: { type: String, default: '' },
        level: { type: String, required: true },
        duration: { type: Number, required: true },
        password: { type: String },
        status: { type: String, default: null },
        userId: { type: String, required: true },
        quiz: { type: [QuestionSchema], required: true },
    },
    { timestamps: true },
);

QuizSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

QuizSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('quizzes', QuizSchema);
