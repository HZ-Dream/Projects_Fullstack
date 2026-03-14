const Chat = require('../../models/chat/Chat');
const User = require('../../models/User');
const Admin = require('../../models/Admin');

class ChatController {
    // [POST] /accessChat
    async accessChat(req, res) {
        const { userId, myId, isAdmin } = req.body;

        try {
            if (!userId || !myId) {
                return res.status(400).json({ msg: 'Both userId and myId are required' });
            }

            let isChat;
            if (isAdmin) {
                isChat = await Chat.find({
                    isGroupChat: false,
                    $and: [{ admins: { $elemMatch: { $eq: myId } } }, { admins: { $elemMatch: { $eq: userId } } }],
                })
                    .populate('users', '-password')
                    .populate('admins', '-password')
                    .populate('latestMessage');
            } else {
                isChat = await Chat.find({
                    isGroupChat: false,
                    $and: [{ users: { $elemMatch: { $eq: myId } } }, { users: { $elemMatch: { $eq: userId } } }],
                })
                    .populate('users', '-password')
                    .populate('admins', '-password')
                    .populate('latestMessage');
            }

            if (isChat.length > 0) {
                return res.json(isChat[0]);
            }

            const chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: !isAdmin ? [myId, userId] : [],
                admins: isAdmin ? [myId, userId] : [],
            };

            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findById(createdChat._id)
                .populate('users', '-password')
                .populate('admins', '-password');

            res.status(200).json(fullChat);
        } catch (err) {
            console.error('Lỗi tại accessChat:', err);
            res.status(500).json({ msg: 'Something went wrong!', error: err.message });
        }
    }

    // [GET] /fetchChat/:myId
    async fetchChat(req, res) {
        const { myId } = req.params;
        try {
            if (!myId) {
                return res.status(400).json({ msg: 'Your ID (myId) is required' });
            }

            const chats = await Chat.find({
                $or: [{ users: { $elemMatch: { $eq: myId } } }, { admins: { $elemMatch: { $eq: myId } } }],
            })
                .populate('users', '-password')
                .populate('admins', '-password')
                .populate('groupAdminByUser', '-password')
                .populate('groupAdminByAdmin', '-password')
                .populate('latestMessage')
                .sort({ updatedAt: -1 });

            res.status(200).json(chats);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [POST] /createGroup
    async createGroup(req, res) {
        try {
            const { users, admins, name, myId, isCreatorAdmin } = req.body;

            if (!name || !myId) {
                return res.status(400).json({ msg: 'Group name and your ID are required' });
            }

            let usersList = typeof users === 'string' ? JSON.parse(users) : users || [];
            let adminsList = typeof admins === 'string' ? JSON.parse(admins) : admins || [];

            if (isCreatorAdmin) {
                if (!adminsList.includes(myId)) adminsList.push(myId);
            } else {
                if (!usersList.includes(myId)) usersList.push(myId);
            }

            const groupChat = await Chat.create({
                chatName: name,
                users: usersList,
                admins: adminsList,
                isGroupChat: true,
                groupAdminByUser: !isCreatorAdmin ? myId : null,
                groupAdminByAdmin: isCreatorAdmin ? myId : null,
            });

            const fullGroupChat = await Chat.findById(groupChat._id)
                .populate('users', '-password')
                .populate('admins', '-password')
                .populate('groupAdminByUser', '-password')
                .populate('groupAdminByAdmin', '-password');

            res.status(200).json(fullGroupChat);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /renameGroup
    async renameGroup(req, res) {
        try {
            const { chatId, chatName } = req.body;

            if (!chatId || !chatName) {
                return res.status(400).json({ msg: 'ChatId and new name are required' });
            }

            const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
                .populate('users', '-password')
                .populate('admins', '-password')
                .populate('groupAdminByUser', '-password')
                .populate('groupAdminByAdmin', '-password');

            if (!updatedChat) return res.status(404).json({ msg: 'Chat not found' });

            res.json(updatedChat);
        } catch (err) {
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /addToGroup
    async addToGroup(req, res) {
        try {
            const { chatId, userId, isAdmin } = req.body;

            const updateField = isAdmin ? { $push: { admins: userId } } : { $push: { users: userId } };

            const updatedChat = await Chat.findByIdAndUpdate(chatId, updateField, { new: true })
                .populate('users', '-password')
                .populate('admins', '-password')
                .populate('groupAdminByUser', '-password')
                .populate('groupAdminByAdmin', '-password');

            if (!updatedChat) return res.status(404).json({ msg: 'Chat not found' });
            res.json(updatedChat);
        } catch (err) {
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }

    // [PUT] /removeFromGroup
    async removeFromGroup(req, res) {
        try {
            const { chatId, userId, isAdmin } = req.body;

            const updateField = isAdmin ? { $pull: { admins: userId } } : { $pull: { users: userId } };

            const updatedChat = await Chat.findByIdAndUpdate(chatId, updateField, { new: true })
                .populate('users', '-password')
                .populate('admins', '-password')
                .populate('groupAdminByUser', '-password')
                .populate('groupAdminByAdmin', '-password');

            if (!updatedChat) return res.status(404).json({ msg: 'Chat not found' });
            res.json(updatedChat);
        } catch (err) {
            res.status(500).json({ msg: 'Something went wrong!' });
        }
    }
}

module.exports = new ChatController();
