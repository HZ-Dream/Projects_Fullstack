const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Reply
const ReplySchema = new Schema(
    {
        reviewId: { type: String, required: true },
        parentReplyId: { type: String, default: null },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        replyText: { type: String, required: true },
    },
    { timestamps: true },
);

ReplySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ReplySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('replies', ReplySchema);
