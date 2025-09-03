const { myList } = require('../models/myList');
const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const list = await myList.find({ userId: req.params.id });
        if (!list || list.length === 0) {
            return res.status(404).json({ success: false, message: 'No cart found!' });
        }
        return res.status(200).json(list);
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
});

router.post('/add', async (req, res) => {
    try {
        const listItem = await myList.find({ productId: req.body.productId, userId: req.body.userId });
        if (listItem.length === 0) {
            let list = new myList({
                productId: req.body.productId,
                productTitle: req.body.productTitle,
                image: req.body.image,
                rating: req.body.rating,
                priceInit: req.body.priceInit,
                priceDiscount: req.body.priceDiscount || 0,
                userId: req.body.userId,
            });

            list = await list.save();
            return res.status(201).json(list);
        } else {
            return;
        }
    } catch (err) {
        return res.status(500).json({
            error: err,
            success: false,
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const listItem = await myList.findById(req.params.id);
        if (!listItem) {
            return res.status(404).json({
                message: 'Cart not found!',
                success: false,
            });
        }

        const deleteListItem = await myList.findByIdAndDelete(req.params.id);

        if (deleteListItem) {
            return res.status(200).json({
                success: true,
                message: 'List is deleted successfully!',
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Something went wrong!',
            });
        }
    } catch (err) {
        console.error('Error deleting list:', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
        });
    }
});

module.exports = router;
