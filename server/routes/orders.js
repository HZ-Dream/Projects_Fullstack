const { Order } = require('../models/order');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const totalPosts = await Order.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page < 1 || page > totalPages) {
        return res.status(400).json({
            message: 'Page not found!',
        });
    }

    const orderList = await Order.find()
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

    if (!orderList) {
        res.status(500).json({ success: false });
    }

    return res.status(200).json({
        orderList: orderList,
        totalPages: totalPages,
        totalOrders: totalPosts,
        page: page,
    });
});

router.get('/:id', async (req, res) => {
    try {
        const orderList = await Order.find({ userId: req.params.id });
        if (!orderList || orderList.length === 0) {
            return res.status(200).json([]);
        }
        return res.status(200).json(orderList);
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
});

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
