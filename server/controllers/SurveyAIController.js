const SurveyAI = require('../models/SurveyAI');
const mongoose = require('mongoose');

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

const confirmFiles = async (urls) => {
    const publicIds = urls.map((url) => getPublicIdFromUrl(url)).filter((id) => id !== null);

    if (publicIds.length > 0) {
        try {
            const result = await cloudinary.uploader.remove_tag('temp_upload_word_survey_ai', publicIds);
        } catch (e) {
            console.error('Lỗi khi gỡ tag trên Cloudinary:', e);
        }
    }
};

class SurveyAIController {
    // [POST] /surveyAI/uploadFile
    async uploadFile(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: true, msg: 'No file uploaded!' });
            }

            const wordFile = req.file;

            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };

            const result = await cloudinary.uploader.upload(wordFile.path, {
                ...options,
                resource_type: 'raw',
                tags: ['temp_upload_word_survey_ai'],
            });

            fs.unlinkSync(req.file.path);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [GET] /surveyAI/getList?page=num
    async getList(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        const { sort } = req.query;

        try {
            // Sort
            let listSort = {};

            if (sort === 'latest') {
                listSort = { updatedAt: -1 };
            } else if (sort === 'oldest') {
                listSort = { updatedAt: 1 };
            } else if (sort === 'low') {
                listSort = { rate: 1 };
            } else if (sort === 'high') {
                listSort = { rate: -1 };
            }

            const totalLists = await SurveyAI.countDocuments();

            const list = await SurveyAI.find()
                .populate('userId')
                .populate('quizId')
                .sort(listSort)
                .skip(skip)
                .limit(limit);

            res.status(200).json({
                list,
                totalPages: Math.ceil(totalLists / limit),
                currentPage: page,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /surveyAI/submitSurvey
    async submitSurvey(req, res) {
        try {
            const { userId, rate, linkFile, description, quizId } = req.body;

            if (!userId || !rate || !quizId) {
                return res.status(400).json({
                    msg: 'Missing required fields',
                });
            }

            const newSurvey = new SurveyAI({
                userId,
                rate,
                linkFile,
                description,
                quizId,
            });

            await newSurvey.save();

            if (linkFile !== '') {
                await confirmFiles([linkFile]);
            }

            return res.status(200).json({ msg: 'Survey submitted successfully!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new SurveyAIController();
