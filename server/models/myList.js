const mongoose = require('mongoose');

const myListSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    productTitle: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
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
    userId: {
        type: String,
        required: true,
    },
});

myListSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

myListSchema.set('toJSON', {
    virtuals: true,
});

exports.myList = mongoose.model('myList', myListSchema);
exports.myListSchema = myListSchema;
