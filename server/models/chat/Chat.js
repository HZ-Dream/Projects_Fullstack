const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Chat
const ChatSchema = new Schema(
    {
        chatName: { type: String, required: true },
        isGroupChat: { type: Boolean, default: false },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
        ],
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'admins',
            },
        ],
        latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'messages' },
        groupAdminByUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        groupAdminByAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'admins',
        },
    },
    {
        timestamps: true,
    },
);

ChatSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ChatSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('chats', ChatSchema);
