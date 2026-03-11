const Bill = require('../models/Bill');

const totalSuccessBill = (arr) => {
    const count = arr.filter((bill) => bill.status === 'success').length;
    return count;
};

const totalProfitBill = (arr) => {
    return arr.reduce((total, bill) => {
        if (bill.status === 'success') {
            total += bill.pricePack;
        }
        return total;
    }, 0);
};

class BillController {
    // [GET] /bill/list?page=N*
    async list(req, res) {
        const { sort } = req.query;

        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 5;
            const totalBills = await Bill.countDocuments();
            const totalPages = Math.ceil(totalBills / perPage);

            if (page < 1 || page > totalPages) {
                return res.status(400).json({
                    message: 'Page not found!',
                });
            }

            // Sort
            let listSort = {};

            if (sort === 'latest') {
                listSort = { createdAt: -1 };
            } else if (sort === 'oldest') {
                listSort = { createdAt: 1 };
            } else if (sort === 'cheap') {
                listSort = { pricePack: 1 };
            } else if (sort === 'expensive') {
                listSort = { pricePack: -1 };
            }

            const billData = await Bill.find();
            const totalSuccess = totalSuccessBill(billData);
            const totalProfit = totalProfitBill(billData);

            const billList = await Bill.find()
                .populate('userId')
                .sort(listSort)
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
                totalSuccess,
                totalProfit,
                page,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /bill/getByUser?page=N*
    async getByUser(req, res) {
        const { sort } = req.query;
        const { userId } = req.params;
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 5;
            const totalBills = await Bill.countDocuments({ userId });
            const totalPages = Math.ceil(totalBills / perPage);

            if (page < 1 || page > totalPages) {
                return res.status(400).json({
                    message: 'Page not found!',
                });
            }

            // Sort
            let listSort = {};

            if (sort === 'latest') {
                listSort = { createdAt: -1 };
            } else if (sort === 'oldest') {
                listSort = { createdAt: 1 };
            } else if (sort === 'cheap') {
                listSort = { pricePack: 1 };
            } else if (sort === 'expensive') {
                listSort = { pricePack: -1 };
            }

            const billUser = await Bill.find({ userId });
            const totalTokens = totalToken(billUser);

            const billList = await Bill.find({ userId })
                .populate('userId')
                .sort(listSort)
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
                totalTokens,
                page,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new BillController();
