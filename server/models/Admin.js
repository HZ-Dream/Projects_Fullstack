const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Admin
const AdminSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        password: { type: String, required: true },
        image: { type: String, default: '' },
        isAdmin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

AdminSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

AdminSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('admins', AdminSchema);
