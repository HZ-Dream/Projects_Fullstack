const Bill = require('../models/Bill');

class BillController {
    // [GET] /bill/list?page=N*
    async list(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 3;
            const totalBills = await Bill.countDocuments();
            const totalPages = Math.ceil(totalBills / perPage);

            if (page < 1 || page > totalPages) {
                return res.status(400).json({
                    message: 'Page not found!',
                });
            }

            const billList = await Bill.find()
                .populate('userId')
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();

            if (!billList) {
                res.status(500).json({ success: false });
            }

            res.status(200).json({
                billList,
                totalPages,
                totalBills,
                page,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new BillController();
