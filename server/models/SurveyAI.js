const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SurveyAI
const SurveyAISchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        rate: { type: String, required: true },
        linkFile: { type: String, default: '' },
        description: { type: String, default: '' },
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'quizzes', required: true },
    },
    { timestamps: true },
);

SurveyAISchema.virtual('id').get(function () {
    return this._id.toHexString();
});

SurveyAISchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('survey_ais', SurveyAISchema);
