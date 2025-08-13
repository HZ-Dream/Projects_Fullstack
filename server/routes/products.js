const { Product } = require('../models/product');
const { Category } = require('../models/category');

const express = require('express');
const router = express.Router();

const multer = require('multer');
const fs = require('fs');

var imagesArr = [];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/products');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.post(
    '/upload',
    upload.array('images', 5), // Max 5 images
    async (req, res) => {
        try {
            imagesArr = [];
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
    const totalPosts = await Product.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page < 1 || page > totalPages) {
        return res.status(400).json({
            message: 'Page not found!',
        });
    }

    const productList = await Product.find()
        .populate('category')
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

    if (!productList) {
        res.status(500).json({ success: false });
    }

    return res.status(200).json({
        productList: productList,
        totalPages: totalPages,
        totalProducts: totalPosts,
        page: page,
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
        images: imagesArr,
        brand: req.body.brand,
        priceInit: req.body.priceInit,
        priceDiscount: req.body.priceDiscount,
        flavor: req.body.flavor,
        weight: req.body.weight,
        tag: req.body.tag,
        category: req.body.category,
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
            images: imagesArr,
            brand: req.body.brand,
            priceInit: req.body.priceInit,
            priceDiscount: req.body.priceDiscount,
            flavor: req.body.flavor,
            weight: req.body.weight,
            tag: req.body.tag,
            category: req.body.category,
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
