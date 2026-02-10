import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Box,
    IconButton,
    useMediaQuery,
    useTheme,
    ListItemButton
} from '@mui/material';
import Loader from './Loader';
import CloseIcon from '@mui/icons-material/Close';
import { getNetwork } from '../services/socialService';
import FollowButton from './FollowButton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NetworkUser {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    socialHandles?: {
        github?: string;
        codeforces?: string;
        leetcode?: string;
        linkedin?: string;
    };
}

interface NetworkModalProps {
    open: boolean;
    onClose: () => void;
    userId: string;
    initialTab?: number; // 0 for followers, 1 for following
}

const NetworkModal: React.FC<NetworkModalProps> = ({ open, onClose, userId, initialTab = 0 }) => {
    const [tabValue, setTabValue] = useState(initialTab);
    const [followers, setFollowers] = useState<NetworkUser[]>([]);
    const [following, setFollowing] = useState<NetworkUser[]>([]);
    const [loading, setLoading] = useState(false);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        if (open && userId) {
            fetchNetwork();
            setTabValue(initialTab);
        }
    }, [open, userId, initialTab]);

    const fetchNetwork = async () => {
        setLoading(true);
        try {
            const { data } = await getNetwork(userId);
            setFollowers(data.followers);
            setFollowing(data.following);
        } catch (error) {
            console.error("Failed to fetch network", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleUserClick = (id: string) => {
        navigate(`/profile/${id}`);
        onClose();
    };

    const currentList = tabValue === 0 ? followers : following;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : 1,
                    maxHeight: fullScreen ? '100%' : 600
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 0 }}>
                <Typography variant="h6" fontWeight="bold">
                    {tabValue === 0 ? 'Followers' : 'Following'}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                    <Tab label={`Followers (${followers.length})`} />
                    <Tab label={`Following (${following.length})`} />
                </Tabs>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Loader />
                    </Box>
                ) : (
                    <List>
                        {currentList.length > 0 ? (
                            currentList.map((user) => (
                                <ListItem
                                    key={user._id}
                                    disablePadding
                                    secondaryAction={
                                        currentUser?._id !== user._id && (
                                            <Box onClick={(e) => e.stopPropagation()}>
                                                <FollowButton
                                                    userId={user._id}
                                                    initialIsFollowing={currentUser?.following?.includes(user._id) || false}
                                                    onToggle={() => {
                                                    }}
                                                />
                                            </Box>
                                        )
                                    }
                                >
                                    <ListItemButton onClick={() => handleUserClick(user._id)}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" fontWeight="600">
                                                    {currentUser?._id === user._id ? "You" : (user.name || user.email.split('@')[0])}
                                                </Typography>
                                            }
                                            secondary={user.email}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">
                                    {tabValue === 0 ? "No followers yet." : "Not following anyone yet."}
                                </Typography>
                            </Box>
                        )}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default NetworkModal;
