const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('res.cloudinary.com')) return null;

    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/public_id.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;

    let remainingParts = parts.slice(uploadIndex + 1);

    if (remainingParts[0].startsWith('v') && !isNaN(remainingParts[0].substring(1))) {
        remainingParts.shift();
    }

    const lastPart = remainingParts.pop();
    const fileName = lastPart.split('.')[0];
    remainingParts.push(fileName);

    return remainingParts.join('/');
};

const deleteImageByUrl = async (imageUrl) => {
    const publicId = getPublicIdFromUrl(imageUrl);
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (e) {
        console.error('Lỗi xóa ảnh Cloudinary:', e);
    }
};

const confirmImages = async (urls) => {
    const publicIds = urls.map((url) => getPublicIdFromUrl(url)).filter((id) => id !== null);

    if (publicIds.length > 0) {
        try {
            const result = await cloudinary.uploader.remove_tag('temp_upload_avatar_admin', publicIds);
        } catch (e) {
            console.error('Lỗi khi gỡ tag trên Cloudinary:', e);
        }
    }
};

class AdminController {
    // [POST] /quiz/uploadImage
    async uploadImage(req, res) {
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

            const result = await cloudinary.uploader.upload(imageFile.path, {
                ...options,
                tags: ['temp_upload_avatar_admin'],
            });

            fs.unlinkSync(req.file.path);

            return res.status(200).json(result);
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

    // [GET] /admin/getAccount?page=number
    async getAccount(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        try {
            const adminList = await Admin.find().skip(skip).limit(limit);
            const totalAccount = await Admin.countDocuments();

            res.status(200).json({ adminList, totalPages: Math.ceil(totalAccount / limit), currentPage: page });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /admin/getInfo/:adminId
    async getInfo(req, res) {
        const adminId = req.params.adminId;

        try {
            const admin = await Admin.findById(adminId);

            if (!admin) {
                return res.status(404).json({ msg: 'Account not found!' });
            }

            res.status(200).json(admin);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /admin/signUp
    async createAccount(req, res) {
        const { name, email, password, isAdmin } = req.body;

        try {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ error: true, msg: 'Email already exists!' });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const admin = new Admin({
                name,
                email,
                password: hashPassword,
                isAdmin,
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

    // [PUT] /admin/changeProfile/:adminId
    async changeProfile(req, res) {
        const adminId = req.params.adminId;
        const { name, email, phone, image } = req.body;
        try {
            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(404).json({ msg: 'Account not found!' });
            }

            const oldEmail = admin.email;

            if (email !== oldEmail) {
                const existingAdmin = await Admin.findOne({ email: email });
                if (existingAdmin) {
                    res.status(400).json({ msg: 'Email already exists!' });
                    return;
                }
            }

            if (admin.image && admin.image !== image) {
                await deleteImageByUrl(admin.image);
            }

            const imagesToConfirm = [];
            if (image && image.trim() !== '') {
                imagesToConfirm.push(image);
            }

            if (imagesToConfirm.length > 0) {
                await confirmImages(imagesToConfirm);
            }

            admin.name = name || admin.name;
            admin.email = email || admin.email;
            admin.phone = phone || admin.phone;
            admin.image = image || admin.image;

            await admin.save();
            res.status(200).json({ admin });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /admin/changePassword/:adminId
    async changePassword(req, res) {
        const adminId = req.params.adminId;
        const { password, newPassword } = req.body;
        try {
            const user = await Admin.findById(adminId);
            if (!user) {
                return res.status(404).json({ msg: 'Account not found!' });
            }

            const matchPassword = await bcrypt.compare(password, user.password);

            if (!matchPassword) {
                return res.status(400).json({ msg: 'Old password is incorrect!' });
            }

            const hashNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashNewPassword;
            await user.save();
            res.status(200).json({ user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new AdminController();
