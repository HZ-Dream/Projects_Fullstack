const mongoose = require('mongoose');

const homeBannerSchema = mongoose.Schema({
    page: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
});

homeBannerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

homeBannerSchema.set('toJSON', {
    virtuals: true,
});

exports.homeBanner = mongoose.model('homeBanner', homeBannerSchema);
exports.homeBannerSchema = homeBannerSchema;
