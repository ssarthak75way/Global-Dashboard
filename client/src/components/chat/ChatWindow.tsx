import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, Avatar, IconButton, TextField,
    InputAdornment, Paper, useTheme, Menu, MenuItem,
    ListItemIcon, ListItemText, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Snackbar, Alert
} from '@mui/material';
import {
    Send as SendIcon,
    ArrowBack as ArrowBackIcon,
    MoreVert as MoreVertIcon,
    Delete as DeleteIcon,
    Block as BlockIcon,
    Person as PersonIcon,
    Undo as UndoIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getMessages, sendMessage, markAsRead, blockUser, unblockUser, deleteMessage, clearChat } from '../../services/chatService';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { DoneAll as DoneAllIcon, Done as DoneIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ChatWindowProps {
    conversation: any;
    onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onBack }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { socket, onlineUsers } = useSocket();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // Menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [msgAnchorEl, setMsgAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clearChatDialogOpen, setClearChatDialogOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const participant = conversation.participants.find((p: any) => p._id !== currentUser?._id);
    const isOnline = onlineUsers.includes(participant?._id);
    const isBlocked = currentUser?.blockedUsers?.includes(participant?._id);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!conversation.temp) {
            fetchMessages();
            handleMarkAsRead();
        } else {
            setMessages([]);
        }
    }, [conversation._id]);

    const handleMarkAsRead = async () => {
        if (conversation._id && !conversation.temp) {
            try {
                await markAsRead(conversation._id);
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (socket) {
            const handleMessage = (data: any) => {
                if (data.conversationId === conversation._id || (conversation.temp && data.senderId._id === participant._id)) {
                    setMessages(prev => [...prev, data]);
                    if (conversation._id) handleMarkAsRead();
                }
            };

            const handleDisplayTyping = (data: any) => {
                if (data.conversationId === conversation._id) {
                    setIsTyping(true);
                }
            };

            const handleHideTyping = (data: any) => {
                if (data.conversationId === conversation._id) {
                    setIsTyping(false);
                }
            };

            socket.on('newMessage', handleMessage);
            socket.on('displayTyping', handleDisplayTyping);
            socket.on('hideTyping', handleHideTyping);

            return () => {
                socket.off('newMessage', handleMessage);
                socket.off('displayTyping', handleDisplayTyping);
                socket.off('hideTyping', handleHideTyping);
            };
        }
    }, [socket, conversation._id]);

    const fetchMessages = async () => {
        try {
            const res = await getMessages(conversation._id);
            if (res.success) {
                setMessages(res.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const content = newMessage;
        setNewMessage('');
        sendStopTyping();

        try {
            const res = await sendMessage(participant._id, content);
            if (res.success) {
                setMessages(prev => [...prev, {
                    ...res.data,
                    senderId: { _id: currentUser?._id, name: currentUser?.name, avatar: currentUser?.avatar }
                }]);
            }
        } catch (error: any) {
            console.error('Error sending message:', error);
            const message = error.response?.data?.message || 'Failed to send message';
            setErrorMsg(message);
        }
    };

    const handleBlockUnblock = async () => {
        try {
            if (isBlocked) {
                await unblockUser(participant._id);
            } else {
                await blockUser(participant._id);
            }
            // Ideally we should update the currentUser in AuthContext here
            // For now, let's just refresh the page or wait for re-auth
            window.location.reload();
        } catch (error) {
            console.error('Error blocking/unblocking user:', error);
        }
        setAnchorEl(null);
    };

    const handleDeleteMsg = async (type: 'me' | 'everyone') => {
        if (!selectedMsgId) return;
        try {
            await deleteMessage(selectedMsgId, type);
            if (type === 'everyone') {
                setMessages(prev => prev.map(m => m._id === selectedMsgId ? { ...m, content: 'This message was deleted', isDeletedForEveryone: true } : m));
            } else {
                setMessages(prev => prev.filter(m => m._id !== selectedMsgId));
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
        setDeleteDialogOpen(false);
        setMsgAnchorEl(null);
    };

    const handleClearChat = async () => {
        if (!conversation._id) return;
        try {
            await clearChat(conversation._id);
            setMessages([]);
        } catch (error) {
            console.error('Error clearing chat:', error);
            setErrorMsg('Failed to clear chat');
        }
        setClearChatDialogOpen(false);
        setAnchorEl(null);
    };

    const sendTyping = () => {
        if (socket && conversation._id && !conversation.temp) {
            socket.emit('typing', { conversationId: conversation._id, receiverId: participant._id });
        }
    };

    const sendStopTyping = () => {
        if (socket && conversation._id && !conversation.temp) {
            socket.emit('stopTyping', { conversationId: conversation._id, receiverId: participant._id });
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);

        if (!conversation.temp) {
            sendTyping();
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                sendStopTyping();
            }, 2000);
        }
    };

    const renderDateHeader = (date: Date) => {
        let label = format(date, 'MMMM d, yyyy');
        if (isToday(date)) label = 'Today';
        else if (isYesterday(date)) label = 'Yesterday';

        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Typography
                    variant="caption"
                    sx={{
                        bgcolor: 'action.hover',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        color: 'text.secondary',
                        fontWeight: 600
                    }}
                >
                    {label}
                </Typography>
            </Box>
        );
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Header */}
            <Paper square elevation={1} sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={onBack} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box
                        sx={{ position: 'relative', cursor: 'pointer' }}
                        onClick={() => navigate(`/profile/${participant?._id}`)}
                    >
                        <Avatar src={participant?.avatar} sx={{ width: 40, height: 40 }}>
                            {participant?.name?.charAt(0)}
                        </Avatar>
                        {isOnline && !isBlocked && (
                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 12,
                                height: 12,
                                bgcolor: '#4caf50',
                                borderRadius: '50%',
                                border: `2px solid ${theme.palette.background.paper}`
                            }} />
                        )}
                    </Box>
                    <Box
                        sx={{ ml: 1.5, cursor: 'pointer' }}
                        onClick={() => navigate(`/profile/${participant?._id}`)}
                    >
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            {participant?.name}
                        </Typography>
                        <Typography variant="caption" color={isOnline && !isBlocked ? "success.main" : "text.secondary"} sx={{ fontWeight: 600 }}>
                            {isBlocked ? 'Blocked' : isOnline ? 'Active now' : 'Offline'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={() => { navigate(`/profile/${participant?._id}`); setAnchorEl(null); }}>
                        <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>View Profile</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleBlockUnblock} sx={{ color: isBlocked ? 'inherit' : 'error.main' }}>
                        <ListItemIcon>
                            {isBlocked ? <UndoIcon fontSize="small" /> : <BlockIcon fontSize="small" color="error" />}
                        </ListItemIcon>
                        <ListItemText>{isBlocked ? 'Unblock User' : 'Block User'}</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => setClearChatDialogOpen(true)} sx={{ color: 'error.main' }}>
                        <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                        <ListItemText>Clear Chat</ListItemText>
                    </MenuItem>
                </Menu>
            </Paper>

            {/* Messages Area */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    scrollBehavior: 'smooth',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
                }}
            >
                {messages.map((msg, i) => {
                    const isMine = msg.senderId._id === currentUser?._id;
                    const msgDate = new Date(msg.createdAt);
                    const prevMsg = i > 0 ? messages[i - 1] : null;
                    const showDateHeader = !prevMsg || !isSameDay(new Date(prevMsg.createdAt), msgDate);
                    const isRead = msg.readBy?.length > 1;

                    return (
                        <React.Fragment key={i}>
                            {showDateHeader && renderDateHeader(msgDate)}
                            <Box sx={{
                                alignSelf: isMine ? 'flex-end' : 'flex-start',
                                maxWidth: '75%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isMine ? 'flex-end' : 'flex-start',
                                mb: 1.5,
                                position: 'relative',
                                '&:hover .msg-options': { opacity: 1 }
                            }}>
                                <Paper sx={{
                                    p: 1.5,
                                    bgcolor: isMine ? 'primary.main' : 'background.paper',
                                    backgroundImage: isMine ? `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` : 'none',
                                    color: isMine ? 'primary.contrastText' : 'text.primary',
                                    borderRadius: isMine ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    backdropFilter: 'blur(8px)',
                                    border: `1px solid ${isMine ? 'transparent' : theme.palette.divider}`,
                                    fontStyle: msg.isDeletedForEveryone ? 'italic' : 'normal',
                                    opacity: msg.isDeletedForEveryone ? 0.7 : 1
                                }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5 }}>
                                        {msg.content}
                                    </Typography>

                                    {!msg.isDeletedForEveryone && (
                                        <IconButton
                                            className="msg-options"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                right: isMine ? '100%' : 'auto',
                                                left: isMine ? 'auto' : '100%',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                mx: 1
                                            }}
                                            onClick={(e) => {
                                                setMsgAnchorEl(e.currentTarget);
                                                setSelectedMsgId(msg._id);
                                            }}
                                        >
                                            <MoreVertIcon fontSize="inherit" />
                                        </IconButton>
                                    )}
                                </Paper>

                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                        {format(msgDate, 'HH:mm')}
                                    </Typography>
                                    {isMine && !msg.isDeletedForEveryone && (
                                        isRead ?
                                            <DoneAllIcon sx={{ fontSize: 14, color: 'primary.main' }} /> :
                                            <DoneIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                    )}
                                </Box>
                            </Box>
                        </React.Fragment>
                    );
                })}
                {isTyping && (
                    <Box sx={{ alignSelf: 'flex-start', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={participant?.avatar} sx={{ width: 20, height: 20 }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            <div className="chat-loader"></div>
                        </Typography>
                    </Box>
                )}
                <div ref={messagesEndRef} style={{ float: "left", clear: "both" }} />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: `1px solid ${theme.palette.divider}` }}>
                {isBlocked ? (
                    <Box sx={{ textAlign: 'center', py: 1 }}>
                        <Typography variant="body2" color="error" fontWeight={600}>
                            You have blocked this user. Unblock to send messages.
                        </Typography>
                    </Box>
                ) : (
                    <TextField
                        fullWidth
                        placeholder="Write a message..."
                        value={newMessage}
                        onChange={handleMessageChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        multiline
                        maxRows={4}
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        color="primary"
                                        onClick={handleSend}
                                        disabled={!newMessage.trim()}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 4, bgcolor: 'background.default' }
                        }}
                    />
                )}
            </Box>

            {/* Message Action Menu */}
            <Menu
                anchorEl={msgAnchorEl}
                open={Boolean(msgAnchorEl)}
                onClose={() => setMsgAnchorEl(null)}
            >
                <MenuItem onClick={() => handleDeleteMsg('me')}>
                    <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Delete for me</ListItemText>
                </MenuItem>
                {selectedMsgId && messages.find(m => m._id === selectedMsgId)?.senderId._id === currentUser?._id && (
                    <MenuItem onClick={() => setDeleteDialogOpen(true)}>
                        <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                        <ListItemText sx={{ color: 'error.main' }}>Delete for everyone</ListItemText>
                    </MenuItem>
                )}
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Message?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Are you sure you want to delete this message for everyone? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleDeleteMsg('everyone')} color="error">Delete for Everyone</Button>
                </DialogActions>
            </Dialog>

            {/* Clear Chat Confirmation Dialog */}
            <Dialog open={clearChatDialogOpen} onClose={() => setClearChatDialogOpen(false)}>
                <DialogTitle>Clear Chat?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Are you sure you want to clear this chat? All messages will be removed for you. This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setClearChatDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleClearChat} color="error">Clear for Me</Button>
                </DialogActions>
            </Dialog>

            {/* Error Snackbar */}
            <Snackbar
                open={Boolean(errorMsg)}
                autoHideDuration={4000}
                onClose={() => setErrorMsg(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >

                <Typography >{errorMsg}</Typography>
            </Snackbar>
        </Box>
    );
};

export default ChatWindow;
