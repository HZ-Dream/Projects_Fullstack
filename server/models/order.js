const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        coupon: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            required: true,
        },
        note: {
            type: String,
            default: '',
        },
        method: {
            type: String,
            required: true,
        },
        orders: [
            {
                productId: {
                    type: String,
                },
                productName: {
                    type: String,
                },
                image: {
                    type: String,
                },
                price: {
                    type: Number,
                },
                quantity: {
                    type: Number,
                },
                total: {
                    type: Number,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);
exports.orderSchema = orderSchema;
