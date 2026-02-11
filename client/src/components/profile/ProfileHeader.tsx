import React from 'react';
import { Box, Paper, Avatar, Typography, Button, Chip, Stack } from '@mui/material';
import { Email as EmailIcon, Badge as IdIcon, Edit as EditIcon } from '@mui/icons-material';
import { User } from '../../context/AuthContext';
import FollowButton from '../FollowButton';

interface ProfileHeaderProps {
    displayUser: User | null;
    isOwnProfile: boolean;
    onEditClick: () => void;
    styles: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ displayUser, isOwnProfile, onEditClick, styles }) => {
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
                        {!displayUser?.avatar && (displayUser?.name?.[0].toUpperCase() || displayUser?.email?.[0].toUpperCase())}
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
                            <Chip
                                icon={<IdIcon />}
                                label="Verified"
                                color="primary"
                                sx={{ fontWeight: 900, borderRadius: 1, px: 1, height: 32 }}
                            />
                        )}
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
                        <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={700}>
                            {displayUser?.email}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        {isOwnProfile ? (
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={onEditClick}
                                sx={{ borderRadius: 1.5, fontWeight: 900, textTransform: 'none', px: 3 }}
                            >
                                Edit Profile
                            </Button>
                        ) : (
                            <FollowButton targetUserId={displayUser?._id || ''} />
                        )}
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
};

export default ProfileHeader;
