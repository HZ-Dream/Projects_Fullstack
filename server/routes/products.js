const { Product } = require('../models/product');
const { Category } = require('../models/category');

const express = require('express');
const router = express.Router();

const cloudinary = require('../utils/cloudinary');

let pLimit;
(async () => {
    pLimit = (await import('p-limit')).default;
})();

router.get('/', async (req, res) => {
    const productList = await Product.find().populate('category');

    if (!productList) {
        res.status(500).json({ success: false });
    }

    res.send(productList);
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

    const limit = pLimit(2);

    const imagesToUpload = req.body.images.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        });
    });

    const uploadStatus = await Promise.all(imagesToUpload);

    const imgUrl = uploadStatus.map((item) => item.secure_url);

    if (!uploadStatus) {
        return res.status(500).json({
            error: 'Images can not upload!',
            status: false,
        });
    }

    if (req.body.dateCreated && /^\d{2}-\d{2}-\d{4}$/.test(req.body.dateCreated)) {
        const [day, month, year] = req.body.dateCreated.split('-');
        req.body.dateCreated = `${year}-${month}-${day}`;
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        images: imgUrl,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
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

router.delete('/:id', async (req, res) => {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
        return res.status(404).json({
            message: 'Product not found!',
            status: false,
        });
    }

    res.status(200).send({
        message: 'The Product is deleted!',
        status: true,
    });
});

router.put('/:id', async (req, res) => {
    const limit = pLimit(2);

    const imagesToUpload = req.body.images.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        });
    });

    const uploadStatus = await Promise.all(imagesToUpload);

    const imgUrl = uploadStatus.map((item) => item.secure_url);

    if (!uploadStatus) {
        return res.status(500).json({
            error: 'Images can not upload!',
            status: false,
        });
    }

    if (req.body.dateCreated && /^\d{2}-\d{2}-\d{4}$/.test(req.body.dateCreated)) {
        const [day, month, year] = req.body.dateCreated.split('-');
        req.body.dateCreated = `${year}-${month}-${day}`;
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            images: imgUrl,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
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

module.exports = router;
