const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    const { name, phone, email, password, isAdmin } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            res.status(400).json({ error: true, msg: 'Email already exists!' });
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: hashPassword,
            isAdmin: isAdmin || false,
        });

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).json({
            user: result,
            token: token,
            error: false,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong!' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            res.status(400).json({ msg: 'User not found!' });
            return;
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            res.status(400).json({ msg: 'Wrong password. Try again or click forgot password to reset it!' });
            return;
        }

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY,
        );

        res.status(200).json({
            user: existingUser,
            token: token,
            msg: 'User Authenticated',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong!' });
    }
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(500).json({ message: 'The user with the given ID was not found.' });
    }
    res.status(200).send(user);
});

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((user) => {
            if (user) {
                return res.status(200).json({ success: true, message: 'The user is deleted!' });
            } else {
                return res.status(404).json({ success: false, message: 'User not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        res.send({ userCount });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.put('/:id', async (req, res) => {
    const { name, phone, email, password, isAdmin } = req.body;

    try {
        const userExit = await User.findById(req.params.id);
        let newPassWord;

        if (req.body.password) {
            newPassWord = await bcrypt.hash(password, 10);
        } else {
            newPassWord = userExit.password;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: name,
                phone: phone,
                email: email,
                password: newPassWord,
                isAdmin: isAdmin || false,
            },
            { new: true },
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User can not be updated!' });
        }

        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong!' });
    }
});

module.exports = router;
