import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Board: React.FC = () => {
    const theme = useTheme();

    const styles = {
        container: {
            maxWidth: 1400,
            mx: 'auto'
        },
        title: {
            fontWeight: 900,
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }
    };

    return (
        <Box sx={styles.container}>
            <Typography variant="h2" sx={styles.title}>
                Task Board
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Kanban board feature coming soon...
            </Typography>
        </Box>
    );
};

export default Board;
