const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

const multer = require('multer');
const fs = require('fs');

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
    upload.array('images', 1), // Max 1 images
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

// Update image upload route to handle multiple images
router.post('/:id/upload', upload.array('images', 1), async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category && category.images.length > 0) {
        for (const image of category.images) {
            const filePath = `uploads/categories/${image}`;
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
    }

    const imagesArr = req.files.map((file) => file.filename);
    category.images = imagesArr;
    await category.save();

    res.send({ images: imagesArr });
});

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
    const category = await Category.findById(req.params.id);
    const images = category.images;

    if (images.length !== 0) {
        for (image of images) {
            fs.unlinkSync(`uploads/categories/${image}`);
        }
    }

    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
        return res.status(404).json({
            message: 'Category not found!',
            success: false,
        });
    }

    res.status(200).json({
        success: true,
        message: 'Category Deleted!',
    });
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
