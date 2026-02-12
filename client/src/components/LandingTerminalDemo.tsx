import React from 'react';
import { Box } from '@mui/material';
import { Terminal } from './Terminal';

export const LandingTerminalDemo: React.FC = () => {
    return (
        <Terminal>
            <Box sx={{ color: '#9ca3af', mb: 0.5 }}>&gt; devconnect --info</Box>

            <Box sx={{ my: 1.5 }} />

            <Box sx={{ color: '#4ade80', mb: 0.5 }}>
                <Box component="span" sx={{ mr: 1 }}>✔</Box>
                Professional Developer Profiles
            </Box>

            <Box sx={{ color: '#4ade80', mb: 0.5 }}>
                <Box component="span" sx={{ mr: 1 }}>✔</Box>
                ATS-Optimized Resume Builder
            </Box>

            <Box sx={{ color: '#4ade80', mb: 0.5 }}>
                <Box component="span" sx={{ mr: 1 }}>✔</Box>
                Activity Tracking & Analytics
            </Box>

            <Box sx={{ color: '#4ade80', mb: 0.5 }}>
                <Box component="span" sx={{ mr: 1 }}>✔</Box>
                Project Showcase & Portfolio
            </Box>

            <Box sx={{ color: '#4ade80', mb: 0.5 }}>
                <Box component="span" sx={{ mr: 1 }}>✔</Box>
                Developer Community & Networking
            </Box>

            <Box sx={{ my: 1.5 }} />

            <Box sx={{ color: '#60a5fa', mb: 0.5 }}>
                <Box component="span" sx={{ mr: 1 }}>→</Box>
                Join 10,000+ developers today
            </Box>
        </Terminal>
    );
};

export default LandingTerminalDemo;
