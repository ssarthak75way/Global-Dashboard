import React from 'react';
import { Box, Paper, Avatar, Typography, Button, Chip, Stack, Tooltip } from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { useAuth, User } from '../../context/AuthContext';
import FollowButton from '../FollowButton';
import { GoVerified } from "react-icons/go";
import { AiOutlineEdit } from "react-icons/ai";

interface ProfileHeaderProps {
    displayUser: User | null;
    isOwnProfile: boolean;
    onEditClick: () => void;
    styles: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ displayUser, isOwnProfile, onEditClick, styles }) => {
    const { user: currentUser } = useAuth();
    const isFollowing = currentUser?.following?.includes(displayUser?._id || '') || false;

    return (
        <Paper elevation={0} sx={styles.bentoCard}>
            <Box sx={styles.identityWrapper}>
                <Box>
                    <Avatar
                        src={displayUser?.avatar}
                        sx={{
                            ...styles.avatar,
                            background: displayUser?.avatar ? 'transparent' : styles.avatar.background
                        }}
                    >
                        {!displayUser?.avatar && (displayUser?.name?.[0]?.toUpperCase() || displayUser?.email?.[0]?.toUpperCase() || '?')}
                    </Avatar>
                    {displayUser?.status ? (
                        <Chip
                            label={displayUser.status}
                            size="medium"
                            onClick={isOwnProfile ? onEditClick : undefined}
                            sx={{
                                mt: -1.5,
                                bgcolor: (theme) => theme.palette.mode === 'light' ? 'white' : 'grey.900',
                                border: '1px solid',
                                borderColor: 'divider',
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                borderRadius: 1,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                zIndex: 2,
                                cursor: isOwnProfile ? 'pointer' : 'default',
                                '&:hover': isOwnProfile ? {
                                    bgcolor: 'action.hover',
                                    transform: 'scale(1.05)',
                                    transition: 'all 0.2s'
                                } : {}
                            }}
                        />
                    ) : (
                        isOwnProfile && (
                            <Button
                                size="small"
                                variant="text"
                                onClick={onEditClick}
                                sx={{ mt: -1, fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.5, '&:hover': { opacity: 1 } }}
                            >
                                + Set Status
                            </Button>
                        )
                    )}
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2} mb={2}>
                        <Typography variant="h3" sx={styles.name}>
                            {displayUser?.name || displayUser?.email.split('@')[0]}
                        </Typography>
                        {displayUser?.isVerified && (
                            <GoVerified size={32} />
                        )}
                    </Stack>

                    {displayUser?.bio && (
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            sx={{ fontWeight: 700, mb: 2, opacity: 0.9, letterSpacing: 0.5 }}
                        >
                            {displayUser.bio}
                        </Typography>
                    )}

                    <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
                        <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={700}>
                            {displayUser?.email}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        {!isOwnProfile &&
                            <FollowButton
                                userId={displayUser?._id || ''}
                                initialIsFollowing={isFollowing}
                                onToggle={(newStatus) => {
                                    console.log('Follow status changed:', newStatus);
                                }}
                            />
                        }
                    </Stack>
                </Box>
                <Box>
                   {isOwnProfile && 
                   <Tooltip title="Edit Profile" onClick={onEditClick} style={styles.editbutton} >
                        <AiOutlineEdit size={32} />
                   </Tooltip>
                }
                </Box>
            </Box>
        </Paper>
    );
};

export default ProfileHeader;
