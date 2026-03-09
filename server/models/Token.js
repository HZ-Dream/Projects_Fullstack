const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Token
const TokenSchema = new Schema(
    {
        image: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        priceInit: { type: Number, required: true },
        priceDiscount: { type: Number, default: 0 },
        token: { type: Number, required: true },
    },
    {
        timestamps: true,
    },
);

TokenSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

TokenSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('tokens', TokenSchema);
