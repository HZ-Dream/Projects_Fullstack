const { productReview } = require('../models/productReview');
const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    let reviews = [];
    try {
        if (req.params.id !== undefined && req.params.id !== null && req.params.id !== '') {
            reviews = await productReview.find({ productId: req.params.id });
        } else {
            reviews = await productReview.find();
        }

        if (!reviews) {
            res.status(500).json({ success: false });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// router.get('/:id', async (req, res) => {
//     const review = await productReview.findById(req.params.id);

//     if (!review) {
//         res.status(500).json({ message: 'The review with the given ID was not found' });
//     }

//     return res.status(200).send(review);
// });

router.post('/add', async (req, res) => {
    let review = new productReview({
        productId: req.body.productId,
        customerId: req.body.customerId,
        customerName: req.body.customerName,
        review: req.body.review || '',
        rating: req.body.rating || 1,
    });

    if (!review) {
        res.status(500).json({
            error: err,
            success: false,
        });
    }

    review = await review.save();
    res.status(201).json(review);
});

module.exports = router;
