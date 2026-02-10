import React from 'react';
import './Loader.css';
import { Box, SxProps, Theme } from '@mui/material';

interface LoaderProps {
    size?: number;
    color?: string; // Allow overriding the main border color if needed
    sx?: SxProps<Theme>;
}

const Loader: React.FC<LoaderProps> = ({ size = 48, color, sx }) => {
    // Calculate scale if size is different from default 48px
    const scale = size / 48;

    return (
        <Box
            sx={{
                width: size,
                height: size,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden', // Ensure no layout overflow
                ...sx
            }}
        >
            <Box
                component="span"
                className="loader"
                sx={{
                    transform: `scale(${scale})`,
                    // transformOrigin: 'center', // Default is usually center, which works perfectly for centering in the wrapper
                    flexShrink: 0, // Prevent shrinking in flex containers
                }}
                style={{
                    borderColor: color
                }}
            />
        </Box>
    );
};

export default Loader;
