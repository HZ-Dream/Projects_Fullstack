const { Category } = require('../models/category');
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
        cb(null, 'uploads/categories');
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
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found!',
                    success: false,
                });
            }

            // Delete Image in Cloudinary
            if (category.images.length > 0) {
                for (const imageUrl of category.images) {
                    // example: https://res.cloudinary.com/<cloud_name>/image/upload/v1690000000/filename.jpg
                    const parts = imageUrl.split('/');
                    const filename = parts[parts.length - 1];
                    const publicId = filename.split('.')[0];

                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Delete Image in ImageUpload
            await ImageUpload.deleteMany({ images: { $in: category.images } });

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
    const totalPosts = await Category.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page < 1 || page > totalPages) {
        return res.status(400).json({
            message: 'Page not found!',
        });
    }

    const categoryList = await Category.find()
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

    if (!categoryList) {
        res.status(500).json({ success: false });
    }

    return res.status(200).json({
        categoryList: categoryList,
        totalPages: totalPages,
        totalCategories: totalPosts,
        page: page,
    });
});

router.get('/all', async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false });
    }

    return res.status(200).json({
        categoryList: categoryList,
    });
});

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(500).json({ message: 'The category with the given ID was not found!' });
    }
    return res.status(200).send(category);
});

router.post('/create', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        subCat: req.body.subCat,
        images: req.body.images,
        color: req.body.color,
    });

    if (!category) {
        return res.status(500).json({
            error: err,
            success: false,
        });
    }

    category = await category.save();

    res.status(201).json(category);
});

router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found!',
                success: false,
            });
        }

        // Delete Image in Cloudinary
        if (category.images.length > 0) {
            for (const imageUrl of category.images) {
                // example: https://res.cloudinary.com/<cloud_name>/image/upload/v1690000000/filename.jpg
                const parts = imageUrl.split('/');
                const filename = parts[parts.length - 1];
                const publicId = filename.split('.')[0];

                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Delete Image in ImageUpload
        await ImageUpload.deleteMany({ images: { $in: category.images } });

        // Delete Image in Category
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Category and related images deleted successfully!',
        });
    } catch (err) {
        console.error('Error deleting category:', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
        });
    }
});

router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            subCat: req.body.subCat,
            images: req.body.images,
            color: req.body.color,
        },
        { new: true },
    );

    if (!category) {
        return res.status(500).json({
            message: 'Category cannot be updated!',
            success: false,
        });
    }

    res.send(category);
});

module.exports = router;
