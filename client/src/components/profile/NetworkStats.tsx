import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';

interface NetworkStatsProps {
    networkStats: { followers: number; following: number };
    activityStats: { totalPosts: number; currentStreak: number; longestStreak: number; activeDays: number };
    certificationsCount: number;
    onOpenNetworkModal: (tab: number) => void;
    styles: any;
}

const NetworkStats: React.FC<NetworkStatsProps> = ({
    networkStats,
    activityStats,
    certificationsCount,
    onOpenNetworkModal,
    styles
}) => {
    const stats = [
        { label: 'FOLLOWERS', value: networkStats.followers, color: 'primary.main', onClick: () => onOpenNetworkModal(0) },
        { label: 'FOLLOWING', value: networkStats.following, color: 'secondary.main', onClick: () => onOpenNetworkModal(1) },
        { label: 'POSTS', value: activityStats.totalPosts, color: 'info.main' },
        { label: 'CERTIFICATIONS', value: certificationsCount, color: 'warning.main' },
        { label: 'STREAK', value: activityStats.currentStreak, color: 'success.main' },
        { label: 'LONGEST STREAK', value: activityStats.longestStreak, color: 'success.main' }
    ];

    return (
        <Paper elevation={0} sx={styles.bentoCard}>
            <Typography sx={styles.sectionTitle}>Network & Stats</Typography>
            <Grid container spacing={2}>
                {stats.map((stat) => (
                    <Grid item xs={6} key={stat.label}>
                        <Box sx={styles.statBox} onClick={stat.onClick}>
                            <Typography sx={{ ...styles.statValue, color: stat.color }}>
                                {stat.value}
                            </Typography>
                            <Typography sx={styles.statLabel}>
                                {stat.label}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default NetworkStats;
