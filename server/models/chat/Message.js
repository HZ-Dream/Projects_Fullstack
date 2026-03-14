const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Message
const MessageSchema = new Schema(
    {
        senderUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        senderAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'chats' },
    },
    {
        timestamps: true,
    },
);

MessageSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

MessageSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('messages', MessageSchema);
