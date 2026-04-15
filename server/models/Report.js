const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Report
const ReportSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'quizzes', required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, default: 'pending' },
        approveReportBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    },
    { timestamps: true },
);

ReportSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ReportSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('reports', ReportSchema);
