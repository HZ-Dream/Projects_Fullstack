const { Order } = require('../models/order');
const express = require('express');
const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const mappedOrders = req.body.orders.map((item) => ({
            productId: item.productId,
            productName: item.productTitle,
            image: item.images,
            price: item.priceDiscount > 0 ? item.priceDiscount : item.priceInit,
            quantity: item.quantity,
            total: item.subTotal,
        }));

        let order = new Order({
            userId: req.body.userId,
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            coupon: req.body.coupon || '',
            address: req.body.address,
            note: req.body.note || '',
            method: req.body.method,
            orders: mappedOrders,
        });

        order = await order.save();
        return res.status(200).json(order);
    } catch (err) {
        return res.status(500).json({
            error: err,
            success: false,
        });
    }
});

module.exports = router;
