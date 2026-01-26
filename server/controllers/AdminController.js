const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

class AdminController {
    // [POST] /admin/uploadAvatar
    async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: true, msg: 'No file uploaded!' });
            }

            const imageFile = req.file;

            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };

            const result = await cloudinary.uploader.upload(imageFile.path, options);

            fs.unlinkSync(req.file.path);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /admin/replaceAvatar/:adminId
    async replaceAvatar(req, res) {
        try {
            const adminId = req.params.adminId;

            if (!req.file) {
                return res.status(400).json({ error: true, msg: 'No file uploaded!' });
            }

            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(404).json({ msg: 'Admin not found!' });
            }

            if (admin.image && admin.image !== '') {
                try {
                    const parts = admin.image.split('/');
                    const fileName = parts[parts.length - 1];
                    const publicId = fileName.split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (e) {
                    console.error('Error destroying old image: ', e);
                }
            }

            const imageFile = req.file;

            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: true,
            };

            const result = await cloudinary.uploader.upload(imageFile.path, options);

            fs.unlinkSync(req.file.path);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /user/signUp
    async signUp(req, res) {
        const { name, email, phone, password } = req.body;

        try {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ error: true, msg: 'Email already exists!' });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const admin = new Admin({
                name,
                email,
                phone,
                password: hashPassword,
            });

            await admin.save();

            const token = jwt.sign({ email: admin.email, id: admin._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);
            res.status(200).json({
                success: true,
                message: 'Admin created successfully!',
                token,
                error: false,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /admin/signIn
    async signIn(req, res) {
        const { email, password } = req.body;

        try {
            const existingAdmin = await Admin.findOne({ email: email });

            if (!existingAdmin) {
                res.status(400).json({ msg: 'Admin not found!' });
                return;
            }

            const matchPassword = await bcrypt.compare(password, existingAdmin.password);

            if (!matchPassword) {
                res.status(400).json({ msg: 'Wrong password. Try again or click forgot password to reset it!' });
                return;
            }

            const token = jwt.sign(
                { email: existingAdmin.email, id: existingAdmin._id },
                process.env.JSON_WEB_TOKEN_SECRET_KEY,
            );

            res.status(200).json({
                user: existingAdmin,
                token: token,
                msg: 'Admin authenticated successfully!',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new AdminController();
