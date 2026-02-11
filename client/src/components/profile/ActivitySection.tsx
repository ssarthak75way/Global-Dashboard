import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import ActivityHeatmap from '../ActivityHeatmap';

interface ActivitySectionProps {
    activityData: Array<{ date: string; count: number; posts?: number; comments?: number; likes?: number }>;
    styles: any;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ activityData, styles }) => {
    return (
        <Paper elevation={0} sx={styles.bentoCard}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={styles.sectionTitle} mb={0}>
                    Activity & Contributions
                </Typography>
            </Box>
            <ActivityHeatmap values={activityData} />
        </Paper>
    );
};

export default ActivitySection;
