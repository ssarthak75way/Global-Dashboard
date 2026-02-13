import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    Typography,
    Box,
    InputAdornment
} from "@mui/material";
import {
    Search as SearchIcon,
    Send as SendIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import { searchUsersForChat, sendMessage } from "../../services/chatService";
import { getNetwork } from "../../services/socialService";
import { useAuth } from "../../context/AuthContext";

interface User {
    _id: string;
    name: string;
    avatar: string;
    email: string;
}

interface SharePostModalProps {
    open: boolean;
    onClose: () => void;
    postId: string;
    postTitle: string;
}

const SharePostModal = ({ open, onClose, postId, postTitle }: SharePostModalProps) => {
    const { user: currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [followings, setFollowings] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState<string | null>(null);
    const searchTimeout = useRef<any>(null);

    useEffect(() => {
        if (open && currentUser?._id) {
            fetchFollowings();
        }
        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [open, currentUser?._id]);

    const fetchFollowings = async () => {
        setLoading(true);
        try {
            const response = await getNetwork(currentUser?._id!);
            setFollowings(response.data.following);
            setUsers(response.data.following);
        } catch (error) {
            console.error("Failed to fetch followings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (!query.trim()) {
            setUsers(followings);
            return;
        }

        setLoading(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                const response = await searchUsersForChat(query);
                if (response.success) {
                    setUsers(response.data);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleSend = async (targetUserId: string) => {
        setSending(targetUserId);
        try {
            await sendMessage(targetUserId, `Shared a post: ${postTitle}`, postId);
            onClose();
        } catch (error) {
            console.error("Send failed", error);
        } finally {
            setSending(null);
        }
    };

    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Share Post</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
                <Box sx={{ p: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search users to share..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                bgcolor: 'action.hover'
                            }
                        }}
                    />
                </Box>
                <List sx={{ pt: 0, minHeight: 300, maxHeight: 400, overflow: 'auto' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <div className="loader"></div>
                        </Box>
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <ListItem
                                key={user._id}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        color="primary"
                                        onClick={() => handleSend(user._id)}
                                        disabled={sending === user._id}
                                    >
                                        {sending === user._id ? <div className="loader"></div> : <SendIcon />}
                                    </IconButton>
                                }
                                sx={{
                                    '&:hover': { bgcolor: 'action.hover' },
                                    borderRadius: 0
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={user?.avatar} sx={{ width: 40, height: 40 }}>
                                        {user.name[0]?.toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.name}
                                    secondary={user.email}
                                    primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
                                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery ? "No users found" : "Start typing to search friends"}
                            </Typography>
                        </Box>
                    )}
                </List>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit" fullWidth sx={{ borderRadius: 3, fontWeight: 700 }}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SharePostModal;
