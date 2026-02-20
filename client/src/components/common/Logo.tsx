import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';

interface LogoProps {
    fontSize?: string | object;
    color?: string;
    withText?: boolean;
    onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({
    fontSize = { xs: '1.2rem', sm: '1.5rem' },
    color,
    withText = true,
    onClick
}) => {
    const theme = useTheme();

    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                cursor: onClick ? 'pointer' : 'default',
                userSelect: 'none'
            }}
        >
            {/* The strong "D." Icon */}
            <Box
                sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    borderRadius: 1,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': onClick ? {
                        transform: 'scale(1.05) rotate(-2deg)',
                        boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                    } : {}
                }}
            >
                <Typography
                    sx={{
                        color: 'white',
                        fontWeight: 900,
                        fontSize: '1.8rem',
                        lineHeight: 1,
                        mt: -0.2
                    }}
                >
                    D
                </Typography>
            </Box>

            {/* The ". Connect" Text */}
            {withText && (
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 900,
                        fontSize: fontSize,
                        display: 'flex',
                        alignItems: 'center',
                        letterSpacing: -0.5,
                        color: color || 'text.primary',
                        transition: 'color 0.2s'
                    }}
                >
                    <Box component="span" sx={{ color: 'primary.main', mr: 0.2 }}>.</Box>
                    Connect
                </Typography>
            )}
        </Box>
    );
};

export default Logo;
