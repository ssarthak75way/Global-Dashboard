import React from 'react';
import { Grid, Box, Typography, Chip, Fade, useTheme } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import VerifiedIcon from '@mui/icons-material/CheckCircle';
import UnverifiedIcon from '@mui/icons-material/Error';

const WelcomeSection: React.FC = () => {
    const { user } = useAuth();
    const theme = useTheme();

    const styles = {
        welcomeBox: {
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
            border: '1px solid',
            borderColor: 'divider'
        },
        welcomeTitle: {
            fontWeight: 900,
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            mb: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }
    };

    return (
        <Fade in timeout={600}>
            <Box sx={styles.welcomeBox}>
                <Typography variant="h3" sx={styles.welcomeTitle}>
                    Welcome back, {user?.name || user?.email.split('@')[0]}!
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body1" color="text.secondary" fontWeight={600}>
                        {user?.email}
                    </Typography>
                    <Chip
                        icon={user?.isVerified ? <VerifiedIcon /> : <UnverifiedIcon />}
                        label={user?.isVerified ? 'Verified' : 'Unverified'}
                        color={user?.isVerified ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                    />
                </Box>
            </Box>
        </Fade>
    );
};

export default WelcomeSection;
