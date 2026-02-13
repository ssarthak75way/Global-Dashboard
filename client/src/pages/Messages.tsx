import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, useTheme as useMuiTheme } from '@mui/material';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import { getConversations } from '../services/chatService';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Messages: React.FC = () => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const { socket, onlineUsers } = useSocket();
    const { user: currentUser } = useAuth();
    const muiTheme = useMuiTheme();
    const location = useLocation();

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await getConversations();
            if (res.success) {
                setConversations(res.data);

                // Handle navigation from profile
                const state = location.state as { selectedUser?: any };
                if (state?.selectedUser) {
                    const targetUser = state.selectedUser;
                    const existing = res.data.find((c: any) =>
                        c.participants.some((p: any) => p._id === targetUser._id)
                    );

                    if (existing) {
                        setSelectedConversation(existing);
                    } else {
                        setSelectedConversation({
                            _id: 'new',
                            participants: [currentUser, targetUser],
                            temp: true
                        });
                    }
                    // Clear state to avoid re-selection on re-render if needed
                    // window.history.replaceState({}, document.title);
                }
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    useEffect(() => {
        if (socket) {
            const handleIncomingMessage = (data: any) => {
                setConversations(prev => {
                    const exists = prev.find(c => c._id === data.conversationId);
                    if (exists) {
                        // Update existing conversation with last message
                        const updated = prev.map(c => {
                            if (c._id === data.conversationId) {
                                return { ...c, lastMessage: data, updatedAt: new Date() };
                            }
                            return c;
                        });
                        // Sort by updatedAt
                        return updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                    } else {
                        // It's a brand new conversation or first message in a temp one
                        // Re-fetch is safer for new conversations to get full participants
                        fetchConversations();
                        return prev;
                    }
                });
            };

            socket.on('newMessage', handleIncomingMessage);
            return () => {
                socket.off('newMessage', handleIncomingMessage);
            };
        }
    }, [socket]);

    const handleSelectConversation = (conv: any) => {
        setSelectedConversation(conv);
    };

    return (
        <Container maxWidth="lg" sx={{
            py: { xs: 1, md: 4 },
            height: { xs: 'calc(100vh - 64px)', md: 'calc(100vh - 100px)' },
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Paper elevation={3} sx={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden',
                borderRadius: 2,
                bgcolor: 'background.paper',
                mb: { xs: 0, md: 0 }
            }}>
                <Box sx={{
                    width: { xs: selectedConversation ? '0%' : '100%', md: '350px' },
                    borderRight: `1px solid ${muiTheme.palette.divider}`,
                    display: { xs: selectedConversation ? 'none' : 'block', md: 'block' },
                    height: '100%'
                }}>
                    <ConversationList
                        conversations={conversations}
                        onSelect={handleSelectConversation}
                        selectedId={selectedConversation?._id}
                        onlineUsers={onlineUsers}
                    />
                </Box>
                <Box sx={{
                    flex: 1,
                    display: { xs: selectedConversation ? 'block' : 'none', md: 'block' },
                    height: '100%'
                }}>
                    {selectedConversation ? (
                        <ChatWindow
                            conversation={selectedConversation}
                            onBack={() => setSelectedConversation(null)}
                        />
                    ) : (
                        <Box sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            p: 3,
                            textAlign: 'center'
                        }}>
                            <img
                                src="https://cdni.iconscout.com/illustration/premium/thumb/no-messages-illustration-download-in-svg-png-gif-formats--empty-inbox-conversation-pack-interface-illustrations-4835233.png"
                                alt="No selection"
                                style={{ width: '200px', marginBottom: '20px', opacity: 0.6 }}
                            />
                            <Box sx={{ fontSize: '1.2rem', fontWeight: 600, color: 'text.secondary' }}>
                                Select a conversation to start messaging
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Messages;
