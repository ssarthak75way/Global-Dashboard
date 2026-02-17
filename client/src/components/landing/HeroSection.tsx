import React from 'react';
import { Box, Container, Typography, Button, Stack, useTheme, alpha, Fade, Slide } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    RocketLaunch as RocketIcon,
    ArrowForward as ArrowIcon,
    Code as CodeIcon,
    Speed as SpeedIcon,
    Security as SecurityIcon
} from '@mui/icons-material';

const HeroSection: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box sx={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            pt: { xs: 12, md: 0 },
            pb: { xs: 8, md: 0 },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '60%',
                height: '60%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                filter: 'blur(80px)',
                zIndex: 0,
                animation: 'pulse 8s infinite alternate'
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-20%',
                left: '-10%',
                width: '60%',
                height: '60%',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 70%)`,
                filter: 'blur(80px)',
                zIndex: 0,
                animation: 'pulse 8s infinite alternate-reverse'
            },
            '@keyframes pulse': {
                '0%': { transform: 'scale(1) translate(0, 0)' },
                '100%': { transform: 'scale(1.1) translate(20px, -20px)' }
            }
        }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={8}>
                    {/* Left Content */}
                    <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                        <Fade in timeout={1000}>
                            <Box>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        fontWeight: 800,
                                        letterSpacing: 2,
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 2,
                                        display: 'inline-block'
                                    }}
                                >
                                    THE FUTURE OF DEV COLLABORATION
                                </Typography>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                        fontWeight: 900,
                                        lineHeight: 1.1,
                                        mb: 3,
                                        letterSpacing: '-0.02em',
                                        color: 'text.primary'
                                    }}
                                >
                                    Build. Ship. <br />
                                    <Box component="span" sx={{
                                        color: 'primary.main',
                                        position: 'relative',
                                        whiteSpace: 'nowrap',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 10,
                                            left: 0,
                                            width: '100%',
                                            height: '30%',
                                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                                            zIndex: -1,
                                            transform: 'skewX(-10deg)'
                                        }
                                    }}>
                                        Scale Faster.
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                        lineHeight: 1.6,
                                        mb: 5,
                                        maxWidth: { xs: '100%', md: '85%' },
                                        fontSize: { xs: '1rem', md: '1.25rem' }
                                    }}
                                >
                                    The all-in-one platform for modern developers. Track progress,
                                    showcase projects, and connect with a global community of builders.
                                </Typography>

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                                        startIcon={<RocketIcon />}
                                        sx={{
                                            py: 1.8,
                                            px: 4,
                                            borderRadius: '50px',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                            boxShadow: `0 8px 20px -4px ${alpha(theme.palette.primary.main, 0.5)}`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 12px 24px -4px ${alpha(theme.palette.primary.main, 0.6)}`,
                                            }
                                        }}
                                    >
                                        {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                                    </Button>
                                    {!isAuthenticated && (
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={() => navigate('/login')}
                                            endIcon={<ArrowIcon />}
                                            sx={{
                                                py: 1.8,
                                                px: 4,
                                                borderRadius: '50px',
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                borderWidth: 2,
                                                borderColor: 'divider',
                                                color: 'text.primary',
                                                '&:hover': {
                                                    borderWidth: 2,
                                                    borderColor: 'text.primary',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            Sign In
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        </Fade>
                    </Box>

                    {/* Right Visual - 3D Mockup */}
                    <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, perspective: '1500px' }}>
                        <Slide direction="up" in timeout={1200}>
                            <Box sx={{
                                position: 'relative',
                                transformStyle: 'preserve-3d',
                                transform: 'rotateY(-15deg) rotateX(5deg)',
                                animation: 'float 6s ease-in-out infinite',
                                '@keyframes float': {
                                    '0%, 100%': { transform: 'rotateY(-15deg) rotateX(5deg) translateY(0)' },
                                    '50%': { transform: 'rotateY(-12deg) rotateX(8deg) translateY(-20px)' }
                                }
                            }}>
                                {/* Main Interface Layer */}
                                <Box sx={{
                                    bgcolor: 'background.paper',
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: theme.palette.mode === 'light'
                                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                                        : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                    p: 3,
                                    width: '100%',
                                    aspectRatio: '16/10',
                                    position: 'relative',
                                    backdropFilter: 'blur(20px)',
                                    background: theme.palette.mode === 'light'
                                        ? `linear-gradient(135deg, ${alpha('#fff', 0.9)} 0%, ${alpha('#f8fafc', 0.9)} 100%)`
                                        : `linear-gradient(135deg, ${alpha('#1e293b', 0.9)} 0%, ${alpha('#0f172a', 0.9)} 100%)`,
                                }}>
                                    {/* Mockup Header */}
                                    <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10b981' }} />
                                    </Stack>

                                    {/* Mockup Content Grid */}
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{ width: '25%', height: 100, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }} />
                                            <Box sx={{ width: '75%', height: 100, borderRadius: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1) }} />
                                        </Box>
                                        <Box sx={{ width: '100%', height: 180, borderRadius: 2, bgcolor: 'action.hover' }} />
                                    </Stack>

                                    {/* Floating Elements */}
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '10%',
                                        right: '-8%',
                                        p: 2,
                                        bgcolor: 'background.paper',
                                        borderRadius: 2,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        transform: 'translateZ(40px)'
                                    }}>
                                        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#ec4899', color: 'white' }}>
                                            <SpeedIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={700}>Velocity</Typography>
                                            <Typography variant="caption" color="success.main">+24%</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: '15%',
                                        left: '-8%',
                                        p: 2,
                                        bgcolor: 'background.paper',
                                        borderRadius: 2,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        transform: 'translateZ(60px)'
                                    }}>
                                        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#6366f1', color: 'white' }}>
                                            <CodeIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={700}>Commits</Typography>
                                            <Typography variant="caption" color="text.secondary">1,234 today</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        position: 'absolute',
                                        top: '-10%',
                                        left: '20%',
                                        p: 2,
                                        bgcolor: 'background.paper',
                                        borderRadius: 2,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        transform: 'translateZ(30px)'
                                    }}>
                                        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#10b981', color: 'white' }}>
                                            <SecurityIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={700}>Secure</Typography>
                                            <Typography variant="caption" color="success.main">Verified</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Slide>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default HeroSection;
