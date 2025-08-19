const { Product } = require('../models/product');
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
        cb(null, 'uploads/products');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Add new product image
router.post(
    '/upload',
    upload.array('images', 5), // Max 5
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
    upload.array('images', 5), // Max 1
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found!',
                    success: false,
                });
            }

            // Delete Image in Cloudinary
            if (product.images.length > 0) {
                for (const imageUrl of product.images) {
                    // example: https://res.cloudinary.com/<cloud_name>/image/upload/v1690000000/filename.jpg
                    const parts = imageUrl.split('/');
                    const filename = parts[parts.length - 1];
                    const publicId = filename.split('.')[0];

                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Delete Image in ImageUpload
            await ImageUpload.deleteMany({ images: { $in: product.images } });

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
    const perPage = 4;
    const category = req.query.category;

    let filter = {};
    if (category) {
        filter.category = category;
    }

    const totalPosts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / perPage);

    const productList = await Product.find(filter)
        .populate('category')
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

    return res.status(200).json({
        productList,
        totalPages,
        totalProducts: totalPosts,
        page,
    });
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({ message: 'The Product with the given ID was not found!' });
    }
    return res.status(200).send(product);
});

router.post('/create', async (req, res) => {
    const category = await Category.findById(req.body.category);

    if (!category) {
        return res.status(404).send('Invalid Category!');
    }

    req.body.isFeatured = req.body.isFeatured === 'true';

    if (req.body.dateCreated && /^\d{2}-\d{2}-\d{4}$/.test(req.body.dateCreated)) {
        const [day, month, year] = req.body.dateCreated.split('-');
        req.body.dateCreated = `${year}-${month}-${day}`;
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        images: req.body.images,
        brand: req.body.brand,
        priceInit: req.body.priceInit,
        priceDiscount: req.body.priceDiscount,
        flavor: req.body.flavor,
        weight: req.body.weight,
        tag: req.body.tag,
        category: req.body.category,
        subCat: req.body.subCat || '',
        quantity: req.body.quantity,
        rating: req.body.rating || 0,
        numReviews: req.body.numReviews || 0,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated || undefined,
    });

    if (!product) {
        return res.status(500).json({
            error: err,
            success: false,
        });
    }

    product = await product.save();

    res.status(201).json(product);
});

router.put('/:id', async (req, res) => {
    req.body.isFeatured = req.body.isFeatured === 'true';

    if (req.body.dateCreated && /^\d{2}-\d{2}-\d{4}$/.test(req.body.dateCreated)) {
        const [day, month, year] = req.body.dateCreated.split('-');
        req.body.dateCreated = `${year}-${month}-${day}`;
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            priceInit: req.body.priceInit,
            priceDiscount: req.body.priceDiscount,
            flavor: req.body.flavor,
            weight: req.body.weight,
            tag: req.body.tag,
            category: req.body.category,
            subCat: req.body.subCat || '',
            quantity: req.body.quantity,
            rating: req.body.rating || 0,
            numReviews: req.body.numReviews || 0,
            isFeatured: req.body.isFeatured,
            dateCreated: req.body.dateCreated || undefined,
        },
        { new: true },
    );

    if (!product) {
        return res.status(500).json({
            message: 'Product cannot be updated!',
            success: false,
        });
    }

    res.send(product);
});

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found!',
                success: false,
            });
        }

        // Delete Image in Cloudinary
        if (product.images.length > 0) {
            for (const imageUrl of product.images) {
                // example: https://res.cloudinary.com/<cloud_name>/image/upload/v1690000000/filename.jpg
                const parts = imageUrl.split('/');
                const filename = parts[parts.length - 1];
                const publicId = filename.split('.')[0];

                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Delete Image in ImageUpload
        await ImageUpload.deleteMany({ images: { $in: product.images } });

        // Delete Product
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Product and related images deleted successfully!',
        });
    } catch (err) {
        console.error('Error deleting category:', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
        });
    }
});

module.exports = router;
