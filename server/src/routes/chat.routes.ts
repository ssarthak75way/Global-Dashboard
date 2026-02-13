import { Router } from 'express';
import {
    getConversations,
    getMessages,
    sendMessage,
    searchUsersForChat,
    markAsRead,
    blockUser,
    unblockUser,
    deleteMessage,
    clearChat
} from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/messages/:conversationId', getMessages);
router.post('/send', sendMessage);
router.get('/search', searchUsersForChat);
router.patch('/read/:conversationId', markAsRead);
router.post('/block', blockUser);
router.post('/unblock', unblockUser);
router.delete('/message/:messageId', deleteMessage);
router.delete('/clear/:conversationId', clearChat);

export default router;
