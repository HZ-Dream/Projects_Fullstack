const { Cart } = require('../models/cart');
const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const cartList = await Cart.find({ userId: req.params.id });
        if (!cartList || cartList.length === 0) {
            return res.status(200).json([]);
        }
        return res.status(200).json(cartList);
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
});

router.post('/add', async (req, res) => {
    try {
        const cartItem = await Cart.findOne({
            productId: req.body.productId,
            flavor: req.body.flavor,
            weight: req.body.weight,
            userId: req.body.userId,
        });

        if (cartItem) {
            cartItem.quantity = req.body.quantity;
            cartItem.priceDiscount = req.body.priceDiscount || 0;
            cartItem.subTotal = req.body.subTotal;
            await cartItem.save();
            return res.status(200).json(cartItem);
        }

        let cart = new Cart({
            productTitle: req.body.productTitle,
            images: req.body.images,
            rating: req.body.rating,
            flavor: req.body.flavor || '',
            weight: req.body.weight,
            priceInit: req.body.priceInit,
            priceDiscount: req.body.priceDiscount || 0,
            quantity: req.body.quantity,
            subTotal: req.body.subTotal,
            productId: req.body.productId,
            userId: req.body.userId,
        });

        cart = await cart.save();
        return res.status(201).json(cart);
    } catch (err) {
        return res.status(500).json({
            error: err,
            success: false,
        });
    }
});

router.delete('/clear/:userId', async (req, res) => {
    try {
        const cartList = await Cart.find({ userId: req.params.userId });
        if (!cartList || cartList.length === 0) {
            return res.status(404).json({
                message: 'Cart not found!',
                success: false,
            });
        }

        const deleteResult = await Cart.deleteMany({ userId: req.params.userId });

        return res.status(200).json([]);
    } catch (err) {
        console.error('Error deleting cart:', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({
                message: 'Cart not found!',
                success: false,
            });
        }

        const deleteCart = await Cart.findByIdAndDelete(req.params.id);

        if (deleteCart) {
            return res.status(200).json({
                success: true,
                message: 'Cart is deleted successfully!',
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Something went wrong!',
            });
        }
    } catch (err) {
        console.error('Error deleting cart:', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong!',
        });
    }
});

router.put('/:id', async (req, res) => {
    const cart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
            productTitle: req.body.productTitle,
            images: req.body.images,
            rating: req.body.rating,
            flavor: req.body.flavor || '',
            weight: req.body.weight,
            priceInit: req.body.priceInit,
            priceDiscount: req.body.priceDiscount || 0,
            quantity: req.body.quantity,
            subTotal: req.body.subTotal,
            productId: req.body.productId,
            userId: req.body.userId,
        },
        { new: true },
    );

    if (!cart) {
        return res.status(500).json({
            message: 'Cart cannot be updated!',
            success: false,
        });
    }

    res.send(cart);
});

module.exports = router;
