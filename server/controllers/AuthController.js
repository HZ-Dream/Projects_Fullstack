const Auth = require('../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    // [POST] /auth/signUp
    async signUp(req, res) {
        const { name, email, phone, password, isAdmin } = req.body;

        try {
            const existingUser = await Auth.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: true, msg: 'Email already exists!' });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const user = new Auth({
                name,
                email,
                phone,
                password: hashPassword,
                isAdmin: isAdmin || false,
            });

            await user.save();

            const token = jwt.sign({ email: user.email, id: user._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

            res.status(200).json({
                success: true,
                message: 'User created successfully!',
                token,
                error: false,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /auth/signIn
    async signIn(req, res) {
        const { email, password } = req.body;

        try {
            const existingUser = await Auth.findOne({ email: email });

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
    }
}

module.exports = new AuthController();
