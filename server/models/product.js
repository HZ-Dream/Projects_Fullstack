const mongoose = require('mongoose');

const productShema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    brand: {
        type: String,
        default: '',
        required: true,
    },
    priceInit: {
        type: Number,
        default: 0,
        required: true,
    },
    priceDiscount: {
        type: Number,
        default: 0,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    flavor: [
        {
            type: String,
            required: true,
        },
    ],
    weight: [
        {
            type: String,
            required: true,
        },
    ],
    tag: [
        {
            type: String,
            required: true,
        },
    ],
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

productShema.virtual('id').get(function () {
    return this._id.toHexString();
});

productShema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productShema);
exports.productShema = productShema;
