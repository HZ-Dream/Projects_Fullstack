const mongoose = require('mongoose');

const ImageUploadSchema = mongoose.Schema({
    images: [
        {
            type: String,
            required: true,
        },
    ],
});

ImageUploadSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ImageUploadSchema.set('toJSON', {
    virtuals: true,
});

exports.ImageUpload = mongoose.model('ImageUpload', ImageUploadSchema);
exports.ImageUploadSchema = ImageUploadSchema;
