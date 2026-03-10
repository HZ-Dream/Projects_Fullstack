const Token = require('../models/Token');

class FieldController {
    // [GET] /token/all
    async all(req, res) {
        try {
            const tokenList = await Token.find();

            if (!tokenList) {
                res.status(500).json({ success: false });
                return;
            }

            res.status(200).json({
                tokenList,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /token/list?page=N*
    async list(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 3;
            const totalTokens = await Token.countDocuments();
            const totalPages = Math.ceil(totalTokens / perPage);

            if (page < 1 || page > totalPages) {
                return res.status(400).json({
                    message: 'Page not found!',
                });
            }

            const tokenList = await Token.find()
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();

            if (!tokenList) {
                res.status(500).json({ success: false });
            }

            res.status(200).json({
                tokenList,
                totalPages,
                totalTokens,
                page,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /token/getItem/:id
    async getItem(req, res) {
        const id = req.params.id;
        try {
            const token = await Token.findById(id);

            res.status(200).json(token);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /token/createToken
    async createToken(req, res) {
        try {
            const { image, name, description, priceInit, priceDiscount, token } = req.body;

            const exitName = await Token.findOne({ name });

            if (exitName) {
                res.status(400).json({ msg: 'Name of Token already exits!' });
                return;
            }

            const newToken = new Token({
                image,
                name,
                description,
                priceInit,
                priceDiscount,
                token,
            });

            await newToken.save();

            res.status(200).json({
                success: true,
                msg: 'Token created successfully!',
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /token/updateToken/:editId
    async updateToken(req, res) {
        const id = req.params.editId;

        try {
            const { image, name, description, priceInit, priceDiscount } = req.body;

            const exitToken = await Token.findById(id);

            if (!exitToken) {
                res.status(400).json({ msg: 'Token not found!' });
                return;
            }

            const oldName = exitToken.name;

            if (name !== oldName) {
                const exitName = await Token.findOne({ name });

                if (exitName) {
                    res.status(400).json({ msg: 'Name of Token already exits!' });
                    return;
                }
            }

            const updateToken = await Token.findByIdAndUpdate(
                id,
                {
                    image,
                    name,
                    description,
                    priceInit,
                    priceDiscount,
                },
                {
                    new: true,
                },
            );

            if (!updateToken) {
                return res.status(404).json({ msg: 'Can not update!' });
            }

            res.status(200).json({ msg: 'Token updated successfully!' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [DELETE] /token/deleteToken/:deleteId
    async deleteToken(req, res) {
        const id = req.params.deleteId;
        try {
            await Token.findByIdAndDelete(id);
            res.status(200).json({ msg: 'Token deleted successfully!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new FieldController();
