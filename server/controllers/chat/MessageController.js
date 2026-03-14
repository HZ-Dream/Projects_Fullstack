const Message = require('../../models/chat/Message');
const Chat = require('../../models/chat/Chat');
const User = require('../../models/User');
const Admin = require('../../models/Admin');

class MessageController {
    // [GET] /allMessages/:chatId
    async allMessages(req, res) {
        const { chatId } = req.params;
        try {
            if (!chatId) {
                return res.status(400).json({ msg: 'Chat ID is required' });
            }

            const messages = await Message.find({ chat: chatId })
                .populate('senderUser', 'name email image')
                .populate('senderAdmin', 'name email image isAdmin')
                .populate({
                    path: 'chat',
                    populate: [
                        { path: 'users', select: 'name email image' },
                        { path: 'admins', select: 'name email image isAdmin' },
                    ],
                });

            res.status(200).json(messages);
        } catch (err) {
            console.error('Lỗi AllMessages:', err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /sendMessage
    async sendMessage(req, res) {
        try {
            const { chatId, content, isAdmin, senderId } = req.body;

            if (!content || !chatId || !senderId) {
                return res.status(400).json({ msg: 'Content, chatId, and senderId are required' });
            }

            const newMessage = {
                chat: chatId,
                content,
                senderUser: !isAdmin ? senderId : null,
                senderAdmin: isAdmin ? senderId : null,
            };

            let message = await Message.create(newMessage);

            message = await message.populate('senderUser', 'name email image');
            message = await message.populate('senderAdmin', 'name email image isAdmin');
            message = await message.populate('chat');

            message = await User.populate(message, {
                path: 'chat.users',
                select: 'name email image',
            });
            message = await Admin.populate(message, {
                path: 'chat.admins',
                select: 'name email image isAdmin',
            });

            await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

            res.status(200).json(message);
        } catch (err) {
            console.error('Lỗi SendMessage:', err);
            res.status(500).json({ msg: 'Something went wrong!', error: err.message });
        }
    }
}

module.exports = new MessageController();
