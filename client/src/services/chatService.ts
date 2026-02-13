import api from '../api/axios';

const API_URL = '/chat';

export const getConversations = async () => {
    const response = await api.get(`${API_URL}/conversations`);
    return response.data;
};

export const getMessages = async (conversationId: string) => {
    const response = await api.get(`${API_URL}/messages/${conversationId}`);
    return response.data;
};

export const sendMessage = async (receiverId: string, content: string) => {
    const response = await api.post(`${API_URL}/send`, { receiverId, content });
    return response.data;
};

export const searchUsersForChat = async (query: string) => {
    const response = await api.get(`${API_URL}/search?query=${query}`);
    return response.data;
};

export const markAsRead = async (conversationId: string) => {
    const response = await api.patch(`${API_URL}/read/${conversationId}`);
    return response.data;
};

export const blockUser = async (userIdToBlock: string) => {
    const response = await api.post(`${API_URL}/block`, { userIdToBlock });
    return response.data;
};

export const unblockUser = async (userIdToUnblock: string) => {
    const response = await api.post(`${API_URL}/unblock`, { userIdToUnblock });
    return response.data;
};

export const deleteMessage = async (messageId: string, type: 'me' | 'everyone') => {
    const response = await api.delete(`${API_URL}/message/${messageId}`, { data: { type } });
    return response.data;
};

export const clearChat = async (conversationId: string) => {
    const response = await api.delete(`${API_URL}/clear/${conversationId}`);
    return response.data;
};
