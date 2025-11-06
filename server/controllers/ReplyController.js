const Reply = require('../models/Reply');

class ReplyController {
    // [POST] /reply/submitReply
    async submitReply(req, res) {
        try {
            const { reviewId, parentReplyId, userId, userName, userImage, replyText } = req.body;

            const newReply = new Reply({
                reviewId,
                parentReplyId: parentReplyId || null,
                userId,
                userName,
                userImage,
                replyText,
            });

            const savedReply = await newReply.save();

            res.status(201).json({
                msg: 'Reply submitted successfully',
                reply: savedReply,
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // [DELETE] /reply/deleteReply/:id
    async deleteReply(req, res) {
        const id = req.params.id;
        try {
            await Reply.findByIdAndDelete(id);
            res.status(200).json({ msg: 'Reply deleted successfully!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new ReplyController();
