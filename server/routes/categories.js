const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

const cloudinary = require('../utils/cloudinary');

let pLimit;
(async () => {
    pLimit = (await import('p-limit')).default;
})();

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

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(500).json({ message: 'The category with the given ID was not found!' });
    }
    return res.status(200).send(category);
});

router.post('/create', async (req, res) => {
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

    let category = new Category({
        name: req.body.name,
        images: imgUrl,
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
    const deletedUser = await Category.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
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

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            images: imgUrl,
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
