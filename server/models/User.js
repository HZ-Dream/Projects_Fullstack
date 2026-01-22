const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User
const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        password: { type: String, required: true },
        image: { type: String, default: '' },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'quizzes' }],
        isAdmin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('users', UserSchema);
