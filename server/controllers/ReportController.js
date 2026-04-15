const Report = require('../models/Report');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Admin = require('../models/Admin');

class ReportController {
    // [GET] /report/reportList?page=N*
    async reportList(req, res) {
        const { sort } = req.query;

        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 5;

            let filter = {};

            if (sort === 'pending') {
                filter.status = 'pending';
            } else if (sort === 'approve') {
                filter.status = 'approve';
            }

            let listSort = {};
            if (sort === 'latest') {
                listSort = { createdAt: -1 };
            } else if (sort === 'oldest') {
                listSort = { createdAt: 1 };
            }

            const totalReports = await Report.countDocuments(filter);
            const totalPages = Math.ceil(totalReports / perPage);

            if (page < 1 || page > totalPages) {
                return res.status(400).json({ message: 'Page not found!' });
            }

            const reportList = await Report.find(filter)
                .populate('userId')
                .populate('quizId')
                .populate('approveReportBy')
                .sort(listSort)
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();

            res.status(200).json({
                reportList,
                totalPages,
                page,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /report/reportByUser/:userId?page=N&sort=?
    async reportByUser(req, res) {
        const { sort } = req.query;
        const { userId } = req.params;

        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 4;

            let filter = { userId };

            if (sort === 'pending') {
                filter.status = 'pending';
            } else if (sort === 'approve') {
                filter.status = 'approve';
            }

            let listSort = {};
            if (sort === 'latest') {
                listSort = { createdAt: -1 };
            } else if (sort === 'oldest') {
                listSort = { createdAt: 1 };
            }

            const totalReports = await Report.countDocuments(filter);
            const totalPages = Math.ceil(totalReports / perPage);

            let currentPage = page;

            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages || 1;

            const reportList = await Report.find(filter)
                .populate('userId')
                .populate('quizId')
                .populate('approveReportBy')
                .sort(listSort)
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .exec();

            res.status(200).json({
                reportList,
                totalPages,
                page,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /report/create
    async createReport(req, res) {
        const { userId, quizId, title, description } = req.body;

        try {
            const checkUser = await User.findById(userId);

            if (!checkUser) {
                res.status(404).json({ msg: 'User not found!' });
            }

            const checkQuiz = await Quiz.findById(quizId);

            if (!checkQuiz) {
                res.status(404).json({ msg: 'Quiz not found!' });
            }

            const newReport = new Report({
                userId,
                quizId,
                title,
                description,
            });

            await newReport.save();

            res.status(200).json(newReport);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /report/approve/:reportId
    async approveReport(req, res) {
        const { reportId } = req.params;
        const { adminId } = req.body;

        try {
            const updated = await Report.findByIdAndUpdate(
                reportId,
                {
                    status: 'approve',
                    approveReportBy: adminId,
                },
                { new: true },
            ).populate('approveReportBy');

            res.status(200).json(updated);
        } catch (err) {
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [DELETE] /report/delete
    async deleteReport(req, res) {
        const reportId = req.params.reportId;
        try {
            await Report.findByIdAndDelete(reportId);
            res.status(200).json({ msg: 'Quiz deleted successfully!' });
        } catch (error) {
            res.status(500).json({ msg: 'Server Error!' });
        }
    }
}

module.exports = new ReportController();
