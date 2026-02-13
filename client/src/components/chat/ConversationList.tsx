import React, { useState } from 'react';
import {
    Divider, IconButton, useTheme, ListItemButton, Paper,
    Fade, ClickAwayListener,
    Box,
    Typography,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { searchUsersForChat } from '../../services/chatService';

interface ConversationListProps {
    conversations: any[];
    onSelect: (conv: any) => void;
    selectedId?: string;
    onlineUsers?: string[];
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, onSelect, selectedId, onlineUsers = [] }) => {
    const { user: currentUser } = useAuth();
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchingUsers, setIsSearchingUsers] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = async (val: string) => {
        setSearchQuery(val);
        if (val.length > 1) {
            setIsSearchingUsers(true);
            try {
                const res = await searchUsersForChat(val);
                if (res.success) {
                    setSearchResults(res.data);
                }
            } catch (error) {
                console.error('Search error:', error);
            }
        } else {
            setIsSearchingUsers(false);
            setSearchResults([]);
        }
    };

    const handleUserSelect = async (user: any) => {
        // Check if conversation exists
        const existing = conversations.find(c =>
            c.participants.some((p: any) => p._id === user._id)
        );

        if (existing) {
            onSelect(existing);
        } else {
            // New conversation placeholder or create immediately
            // For now, let's just create a dummy "new chat" state or letsendMessage create it
            onSelect({
                _id: 'new',
                participants: [currentUser, user],
                temp: true
            });
        }
        setIsSearchingUsers(false);
        setSearchQuery('');
    };

    const getParticipant = (conv: any) => {
        return conv.participants.find((p: any) => p._id !== currentUser?._id);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
            }}>
                <Typography variant="h5" fontWeight={900} sx={{
                    mb: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px'
                }}>
                    Messages
                </Typography>

                <ClickAwayListener onClickAway={() => setIsSearchingUsers(false)}>
                    <Box>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => searchQuery.length > 1 && setIsSearchingUsers(true)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => handleSearch('')}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2 }
                            }}
                        />

                        <Fade in={isSearchingUsers && (searchResults.length > 0 || searchQuery.length > 1)}>
                            <Paper
                                elevation={8}
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 16,
                                    right: 16,
                                    mt: 1,
                                    zIndex: 10,
                                    maxHeight: 400,
                                    overflow: 'auto',
                                    borderRadius: 2,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                    border: `1px solid ${theme.palette.divider}`
                                }}
                            >
                                <List sx={{ p: 0 }}>
                                    <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary', bgcolor: 'action.hover', fontWeight: 700 }}>
                                        START NEW CONVERSATION
                                    </Typography>
                                    {searchResults.length > 0 ? (
                                        searchResults.map((user) => (
                                            <ListItem key={user._id} disablePadding>
                                                <ListItemButton onClick={() => handleUserSelect(user)} sx={{ py: 1.5 }}>
                                                    <ListItemAvatar>
                                                        <Avatar src={user.avatar} sx={{ width: 44, height: 44, border: `2px solid ${theme.palette.primary.main}` }}>
                                                            {user.name?.charAt(0)}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={user.name}
                                                        secondary={user.title || user.email}
                                                        primaryTypographyProps={{ fontWeight: 800, variant: 'body2' }}
                                                        secondaryTypographyProps={{ variant: 'caption', sx: { color: 'primary.main', fontWeight: 600 } }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Box sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="caption" color="text.secondary">No users found</Typography>
                                        </Box>
                                    )}
                                </List>
                            </Paper>
                        </Fade>
                    </Box>
                </ClickAwayListener>
            </Box>

            <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                {conversations.map((conv) => {
                    const participant = getParticipant(conv);
                    if (!participant) return null;
                    const isSelected = selectedId === conv._id;

                    return (
                        <React.Fragment key={conv._id}>
                            <ListItem
                                disablePadding
                                sx={{
                                    borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                                }}
                            >
                                <ListItemButton
                                    selected={isSelected}
                                    onClick={() => onSelect(conv)}
                                    sx={{
                                        py: 2,
                                        '&.Mui-selected': {
                                            bgcolor: theme.palette.mode === 'light' ? 'primary.light' : 'rgba(99, 102, 241, 0.12)',
                                            '&:hover': { bgcolor: theme.palette.mode === 'light' ? 'primary.light' : 'rgba(99, 102, 241, 0.15)' }
                                        },
                                        transition: 'all 0.2s ease',
                                        '&:hover': { transform: 'translateX(4px)' }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Box sx={{ position: 'relative' }}>
                                            <Avatar src={participant.avatar} sx={{ width: 48, height: 48, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                                {participant.name?.charAt(0)}
                                            </Avatar>
                                            <Box sx={{
                                                position: 'absolute',
                                                bottom: 2,
                                                right: 2,
                                                width: 12,
                                                height: 12,
                                                bgcolor: onlineUsers.includes(participant._id) ? '#4caf50' : '#bdbdbd',
                                                borderRadius: '50%',
                                                border: `2px solid ${theme.palette.background.paper}`,
                                                display: 'block',
                                                zIndex: 1
                                            }} />
                                        </Box>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" fontWeight={isSelected ? 800 : 700}>
                                                    {participant.name}
                                                </Typography>
                                                {conv.lastMessage && (
                                                    <Typography variant="caption" sx={{ color: conv.unreadCount > 0 ? 'primary.main' : 'text.disabled', fontWeight: conv.unreadCount > 0 ? 800 : 400 }}>
                                                        {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    sx={{
                                                        maxWidth: '180px',
                                                        color: conv.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                                                        fontWeight: conv.unreadCount > 0 ? 600 : 400,
                                                        fontStyle: conv.lastMessage?.isDeletedForEveryone ? 'italic' : 'normal'
                                                    }}
                                                >
                                                    {conv.lastMessage?.isDeletedForEveryone ? 'This message was deleted' : (conv.lastMessage?.content || 'Started a conversation')}
                                                </Typography>
                                                {conv.unreadCount > 0 && (
                                                    <Box sx={{
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        borderRadius: '10px',
                                                        px: 1,
                                                        minWidth: '20px',
                                                        height: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 800,
                                                        boxShadow: '0 2px 6px rgba(99, 102, 241, 0.4)'
                                                    }}>
                                                        {conv.unreadCount}
                                                    </Box>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    );
                })}
                {conversations.length === 0 && (
                    <Box sx={{ p: 4, textAlign: 'center', opacity: 0.6 }}>
                        <Typography variant="body2">No conversations yet.</Typography>
                        <Typography variant="caption">Search for a user to start chatting!</Typography>
                    </Box>
                )}
            </List>
        </Box>
    );
};

export default ConversationList;
