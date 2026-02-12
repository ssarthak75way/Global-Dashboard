import React, { useState } from 'react';
import { Button } from '@mui/material';
import Loader from './Loader';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { followUser, unfollowUser } from '../services/socialService';
import { useAuth } from '../context/AuthContext';

interface FollowButtonProps {
    userId: string;
    initialIsFollowing: boolean;
    onToggle: (newStatus: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, initialIsFollowing, onToggle }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    React.useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    const handleClick = async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser(userId);
                setIsFollowing(false);
                onToggle(false);
            } else {
                await followUser(userId);
                setIsFollowing(true);
                onToggle(true);
            }
        } catch (error) {
            console.error("Failed to toggle follow status", error);
        } finally {
            setLoading(false);
        }
    };

    if (user?._id === userId) return null;

    return (
        <Button
            variant={isFollowing ? "outlined" : "contained"}
            color={isFollowing ? "secondary" : "primary"}
            startIcon={loading ? <Loader size={18} color="inherit" /> : (isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />)}
            onClick={handleClick}
            disabled={loading}
            sx={{
                borderRadius: 1,
                px: 3,
                minWidth: '140px',
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: isFollowing ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                    boxShadow: isFollowing ? 'none' : '0 6px 16px rgba(99, 102, 241, 0.4)',
                }
            }}
        >
            {loading ? "Processing..." : (isFollowing ? "Unfollow" : "Follow!")}
        </Button>
    );
};

export default FollowButton;
