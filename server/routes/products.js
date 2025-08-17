const { Product } = require('../models/product');
const { Category } = require('../models/category');

const express = require('express');
const router = express.Router();

const multer = require('multer');
const fs = require('fs');

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
    upload.array('images', 5), // Max 5 images
    async (req, res) => {
        try {
            const imagesArr = [];
            const files = req.files;

            for (let i = 0; i < files.length; i++) {
                imagesArr.push(files[i].filename);
            }

            console.log(imagesArr);
            res.send({ images: imagesArr });
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

// Update image upload route to handle multiple images
router.post('/:id/upload', upload.array('images', 5), async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product && product.images.length > 0) {
        for (const image of product.images) {
            const filePath = `uploads/products/${image}`;
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
    }

    const imagesArr = req.files.map((file) => file.filename);
    product.images = imagesArr;
    await product.save();

    res.send({ images: imagesArr });
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
    const product = await Product.findById(req.params.id);
    const images = product.images;

    if (images.length !== 0) {
        for (image of images) {
            fs.unlinkSync(`uploads/products/${image}`);
        }
    }

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

module.exports = router;
