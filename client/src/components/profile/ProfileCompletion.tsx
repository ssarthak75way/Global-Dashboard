import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import { User } from '../../context/AuthContext';

interface ProfileCompletionProps {
    displayUser: User | null;
    profileCompletion: number;
    styles: any;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ displayUser, profileCompletion, styles }) => {
    return (
        <Paper elevation={0} sx={styles.bentoCard}>
            <Typography sx={styles.sectionTitle}>Profile Completion</Typography>
            <Box sx={styles.progressContainer}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="body2" fontWeight={900} color="text.secondary">
                        {profileCompletion}% Complete
                    </Typography>
                    <Typography variant="caption" fontWeight={800} color="primary.main">
                        {profileCompletion === 100 ? '🎉 Perfect!' : 'Keep going!'}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={profileCompletion}
                    sx={styles.progressBar}
                />
            </Box>
        </Paper>
    );
};

export default ProfileCompletion;
