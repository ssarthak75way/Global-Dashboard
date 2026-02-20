import React from 'react';
import { Box, Container, Typography, Button, useTheme, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CTASection: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box sx={{
            py: { xs: 10, md: 16 },
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
            color: 'white',
            textAlign: 'center'
        }}>
            {/* Background Mesh/Glow */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.4)} 0%, transparent 60%)`,
                zIndex: 0
            }} />

            <Box sx={{
                position: 'absolute',
                top: '-50%',
                left: '-20%',
                width: '60%',
                height: '200%',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
                transform: 'rotate(-45deg)',
                zIndex: 0
            }} />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                    Ready to Start Your Journey?
                </Typography>
                <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, fontWeight: 500, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                    Join thousands of developers building their future with D. Connect.
                    Create, collaborate, and grow—all in one place.
                </Typography>

                {isAuthenticated ? (
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<DashboardIcon />}
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            px: 5,
                            py: 2,
                            borderRadius: '50px',
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            bgcolor: 'white',
                            color: 'primary.main',
                            boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.3)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#f8fafc',
                                transform: 'translateY(-4px)',
                                boxShadow: `0 25px 50px -12px ${alpha(theme.palette.secondary.main, 0.4)}`
                            }
                        }}
                    >
                        Go to Dashboard
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/signup')}
                        sx={{
                            px: 5,
                            py: 2,
                            borderRadius: '50px',
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            bgcolor: 'white',
                            color: 'primary.main',
                            boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.3)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#f8fafc',
                                transform: 'translateY(-4px)',
                                boxShadow: `0 25px 50px -12px ${alpha(theme.palette.secondary.main, 0.4)}`
                            }
                        }}
                    >
                        Get Started Free
                    </Button>
                )}
            </Container>
        </Box>
    );
};

export default CTASection;
