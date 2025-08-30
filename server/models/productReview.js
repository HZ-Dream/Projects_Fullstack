const mongoose = require('mongoose');

const productReivewSchema = mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
        },
        customerId: {
            type: String,
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        review: {
            type: String,
            required: true,
            default: '',
        },
        rating: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    {
        timestamps: true,
    },
);

productReivewSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productReivewSchema.set('toJSON', {
    virtuals: true,
});

exports.productReview = mongoose.model('productReview', productReivewSchema);
exports.productReivewSchema = productReivewSchema;
