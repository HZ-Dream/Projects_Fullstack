const Field = require('../models/Field');

class FieldController {
    // [GET] /field/all
    async all(req, res) {
        try {
            const fieldList = await Field.find();

            if (!fieldList) {
                res.status(500).json({ success: false });
                return;
            }

            res.status(200).json({
                fieldList,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /field/list?page=N*
    async list(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 3;
            const totalFields = await Field.countDocuments();
            const totalPages = Math.ceil(totalFields / perPage);

            if (page < 1 || page > totalPages) {
                return res.status(400).json({
                    message: 'Page not found!',
                });
            }

            const fieldList = await Field.find()
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();

            if (!fieldList) {
                res.status(500).json({ success: false });
            }

            res.status(200).json({
                fieldList,
                totalPages,
                totalFields,
                page,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /field/getItem/:id
    async getItem(req, res) {
        const id = req.params.id;
        try {
            const field = await Field.findById(id);

            res.status(200).json(field);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /field/createField
    async createField(req, res) {
        try {
            const { name, description } = req.body;

            const exitName = await Field.findOne({ name });

            if (exitName) {
                res.status(400).json({ msg: 'Name of Field already exits!' });
                return;
            }

            const newField = new Field({
                name,
                description,
            });

            await newField.save();

            res.status(200).json({
                success: true,
                msg: 'Field created successfully!',
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /field/updateField/:editId
    async updateField(req, res) {
        const id = req.params.editId;

        try {
            const { name, description } = req.body;

            console.log(name, description);

            const exitField = await Field.findById(id);

            if (!exitField) {
                res.status(400).json({ msg: 'Field not found!' });
                return;
            }

            const exitName = await Field.findOne({ name });

            if (exitName) {
                res.status(400).json({ msg: 'Name of Field already exits!' });
                return;
            }

            const updateField = await Field.findByIdAndUpdate(
                id,
                {
                    name,
                    description,
                },
                {
                    new: true,
                },
            );

            console.log(3);

            if (!updateField) {
                return res.status(404).json({ msg: 'Can not update!' });
            }

            res.status(200).json({ msg: 'Field updated successfully!' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [DELETE] /field/deleteField/:deleteId
    async deleteField(req, res) {
        const id = req.params.deleteId;
        try {
            await Field.findByIdAndDelete(id);
            res.status(200).json({ msg: 'Field deleted successfully!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new FieldController();
