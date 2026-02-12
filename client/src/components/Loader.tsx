import React from 'react';
import './Loader.css';
import { Box, SxProps, Theme } from '@mui/material';

interface LoaderProps {
    size?: number;
    color?: string;
    sx?: SxProps<Theme>;
    fullPage?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 48, color, sx, fullPage = false }) => {
    const scale = size / 48;

    return (
        <Box
            sx={{
                width: fullPage ? '100%' : size,
                height: fullPage ? '100%' : size,
                minHeight: fullPage ? '80vh' : 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
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
