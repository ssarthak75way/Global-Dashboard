import { Request, Response, NextFunction } from 'express';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import User from '../models/user.model';
import { getIO } from '../socket';
import mongoose from 'mongoose';

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user._id;

        const conversations = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'name email avatar')
            .populate({
                path: 'lastMessage',
                select: 'content senderId createdAt readBy'
            })
            .sort({ updatedAt: -1 });

        // Calculate unread counts for each conversation
        const conversationsWithUnread = await Promise.all(conversations.map(async (conv) => {
            const unreadCount = await Message.countDocuments({
                conversationId: conv._id,
                senderId: { $ne: userId },
                readBy: { $ne: userId }
            });
            return {
                ...conv.toObject(),
                unreadCount
            };
        }));

        res.status(200).json({
            success: true,
            data: conversationsWithUnread
        });
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { conversationId } = req.params;
        const userId = (req as any).user._id;

        // Check if user is participant
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access to conversation'
            });
        }

        const messages = await Message.find({
            conversationId,
            deletedForUsers: { $ne: userId }
        })
            .sort({ createdAt: 1 })
            .populate('senderId', 'name avatar');

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        next(error);
    }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = (req as any).user._id;

        // Check if blocked
        const receiver = await User.findById(receiverId);
        if (receiver?.blockedUsers.includes(senderId)) {
            return res.status(403).json({
                success: false,
                message: 'You are blocked by this user'
            });
        }

        const sender = await User.findById(senderId);
        if (sender?.blockedUsers.includes(receiverId as any)) {
            return res.status(403).json({
                success: false,
                message: 'You have blocked this user'
            });
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            conversationId: conversation._id,
            senderId,
            content,
            readBy: [senderId]
        });

        conversation.lastMessage = newMessage._id as mongoose.Types.ObjectId;
        await conversation.save();

        // Emit real-time message via socket
        const io = getIO();
        io.to(`user_${receiverId}`).emit('newMessage', {
            ...newMessage.toObject(),
            senderId: {
                _id: senderId,
                name: (req as any).user.name,
                avatar: (req as any).user.avatar
            }
        });

        res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { messageId } = req.params;
        const { type } = req.body; // 'me' or 'everyone'
        const userId = (req as any).user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        if (type === 'everyone') {
            if (message.senderId.toString() !== userId.toString()) {
                return res.status(403).json({ success: false, message: 'Unauthorized to delete for everyone' });
            }
            message.content = 'This message was deleted';
            message.isDeletedForEveryone = true;
        } else {
            // type === 'me'
            if (!message.deletedForUsers.includes(userId)) {
                message.deletedForUsers.push(userId);
            }
        }

        await message.save();

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userIdToBlock } = req.body;
        const userId = (req as any).user._id;

        await User.findByIdAndUpdate(userId, {
            $addToSet: { blockedUsers: userIdToBlock }
        });

        res.status(200).json({
            success: true,
            message: 'User blocked successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const unblockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userIdToUnblock } = req.body;
        const userId = (req as any).user._id;

        await User.findByIdAndUpdate(userId, {
            $pull: { blockedUsers: userIdToUnblock }
        });

        res.status(200).json({
            success: true,
            message: 'User unblocked successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const clearChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { conversationId } = req.params;
        const userId = (req as any).user._id;

        // Add user to deletedForUsers for all messages in this conversation
        await Message.updateMany(
            { conversationId },
            { $addToSet: { deletedForUsers: userId } }
        );

        res.status(200).json({
            success: true,
            message: 'Chat cleared successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const searchUsersForChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.query;
        const currentUserId = (req as any).user._id;

        const users = await User.find({
            _id: { $ne: currentUserId },
            $or: [
                { name: { $regex: query as string, $options: 'i' } },
                { email: { $regex: query as string, $options: 'i' } }
            ]
        }).select('name email avatar').limit(10);

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { conversationId } = req.params;
        const userId = (req as any).user._id;

        await Message.updateMany(
            {
                conversationId,
                senderId: { $ne: userId },
                readBy: { $ne: userId }
            },
            {
                $addToSet: { readBy: userId }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        next(error);
    }
};
