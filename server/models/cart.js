const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    productTitle: {
        type: String,
        required: true,
    },
    images: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    flavor: {
        type: String,
        default: '',
    },
    weight: {
        type: String,
        required: true,
    },
    priceInit: {
        type: Number,
        required: true,
    },
    priceDiscount: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

cartSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

cartSchema.set('toJSON', {
    virtuals: true,
});

exports.Cart = mongoose.model('Cart', cartSchema);
exports.cartSchema = cartSchema;
