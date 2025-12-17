const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Field
const FieldSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

FieldSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

FieldSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('fields', FieldSchema);
