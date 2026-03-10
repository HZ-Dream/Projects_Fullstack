const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bill
const BillSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        txnRef: { type: String, required: true }, // code VNPay
        namePack: { type: String, required: true },
        pricePack: { type: Number, required: true },
        tokenPack: { type: Number, required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed'],
            default: 'pending',
        },
    },
    { timestamps: true },
);

BillSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

BillSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('bills', BillSchema);
