const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Key
const KeySchema = new Schema({
    name: { type: String, required: true },
});

KeySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

KeySchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('keys', KeySchema);
