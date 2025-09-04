const { homeBanner } = require('../models/homeBanner');
const { ImageUpload } = require('../models/imageUpload');

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

let pLimit;
(async () => {
    pLimit = (await import('p-limit')).default;
})();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/homebanners');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Add new image upload route
router.post(
    '/upload',
    upload.array('images', 1), // Max 1
    async (req, res) => {
        try {
            const imagesArr = [];

            for (const file of req.files) {
                const options = {
                    use_filename: true,
                    unique_filename: false,
                    overwrite: false,
                };

                const result = await cloudinary.uploader.upload(file.path, options);
                imagesArr.push(result.secure_url);

                fs.unlinkSync(file.path);
            }

            const imagesUploaded = new ImageUpload({ images: imagesArr });
            await imagesUploaded.save();

            return res.status(200).json(imagesArr);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Upload failed' });
        }
    },
);

// Replace Image
router.post(
    '/:id/upload',
    upload.array('images', 1), // Max 1
    async (req, res) => {
        try {
            const banner = await homeBanner.findById(req.params.id);
            if (!banner) {
                return res.status(404).json({
                    message: 'Banner not found!',
                    success: false,
                });
            }

            // Delete Image in Cloudinary
            if (banner.images.length > 0) {
                for (const imageUrl of banner.images) {
                    // example: https://res.cloudinary.com/<cloud_name>/image/upload/v1690000000/filename.jpg
                    const parts = imageUrl.split('/');
                    const filename = parts[parts.length - 1];
                    const publicId = filename.split('.')[0];

                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Delete Image in ImageUpload
            await ImageUpload.deleteMany({ images: { $in: banner.images } });

            const imagesArr = [];

            for (const file of req.files) {
                const options = {
                    use_filename: true,
                    unique_filename: false,
                    overwrite: false,
                };

                const result = await cloudinary.uploader.upload(file.path, options);
                imagesArr.push(result.secure_url);

                fs.unlinkSync(file.path);
            }

            const imagesUploaded = new ImageUpload({ images: imagesArr });
            await imagesUploaded.save();

            return res.status(200).json(imagesArr);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Upload failed' });
        }
    },
);

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const totalPosts = await homeBanner.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page < 1 || page > totalPages) {
        return res.status(400).json({
            message: 'Page not found!',
        });
    }

    const bannerList = await homeBanner
        .find()
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

    if (!bannerList) {
        res.status(500).json({ success: false });
    }

    return res.status(200).json({
        bannerList: bannerList,
        totalPages: totalPages,
        totalBanners: totalPosts,
        page: page,
    });
});

router.get('/all', async (req, res) => {
    const bannerList = await homeBanner.find();

    if (!bannerList) {
        res.status(500).json({ success: false });
    }

    return res.status(200).json({
        bannerList: bannerList,
    });
});

router.get('/:id', async (req, res) => {
    const banner = await homeBanner.findById(req.params.id);
    if (!banner) {
        return res.status(500).json({ message: 'The Banner with the given ID was not found!' });
    }
    return res.status(200).send(banner);
});

router.post('/create', async (req, res) => {
    let banner = new homeBanner({
        page: req.body.page,
        images: req.body.images,
    });

    if (!banner) {
        return res.status(500).json({
            error: err,
            success: false,
        });
    }

    banner = await banner.save();

    res.status(201).json(banner);
});

router.delete('/:id', async (req, res) => {
    try {
        const banner = await homeBanner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                message: 'Banner not found!',
                success: false,
            });
        }

        // Delete Image in Cloudinary
        if (banner.images.length > 0) {
            for (const imageUrl of banner.images) {
                // example: https://res.cloudinary.com/<cloud_name>/image/upload/v1690000000/filename.jpg
                const parts = imageUrl.split('/');
                const filename = parts[parts.length - 1];
                const publicId = filename.split('.')[0];

                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Delete Image in ImageUpload
        await ImageUpload.deleteMany({ images: { $in: banner.images } });

        // Delete Image in homeBanner
        const deletedBanner = await homeBanner.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'homeBanner and related images deleted successfully!',
        });
    } catch (err) {
        console.error('Error deleting banner:', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
        });
    }
});

router.put('/:id', async (req, res) => {
    const banner = await homeBanner.findByIdAndUpdate(
        req.params.id,
        {
            page: req.body.page,
            images: req.body.images,
        },
        { new: true },
    );

    if (!banner) {
        return res.status(500).json({
            message: 'Banner cannot be updated!',
            success: false,
        });
    }

    res.send(banner);
});

module.exports = router;
