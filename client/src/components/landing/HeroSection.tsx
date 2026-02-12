import React from 'react';
import { Box, Container, Typography, Button, Grid, Stack, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';

const HeroSection: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    const styles = {
        hero: {
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
            position: 'relative',
            overflow: 'hidden'
        },
        heroContent: {
            position: 'relative',
            zIndex: 2
        },
        heroTitle: {
            fontWeight: 900,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem' },
            lineHeight: 1.1,
            mb: { xs: 2, md: 3 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        },
        heroSubtitle: {
            fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.4rem' },
            color: 'text.secondary',
            mb: { xs: 3, md: 4 },
            maxWidth: 600
        },
        ctaButton: {
            px: { xs: 3, md: 4 },
            py: 1.5,
            fontSize: { xs: '0.95rem', md: '1.1rem' },
            fontWeight: 700,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: `0 8px 24px ${theme.palette.primary.main}40`
        }
    };

    return (
        <Box id="home" sx={styles.hero}>
            <Container maxWidth="lg" sx={styles.heroContent}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Typography variant="h1" sx={styles.heroTitle}>
                            Your Complete Developer Platform
                        </Typography>
                        <Typography sx={styles.heroSubtitle}>
                            DevConnect is your all-in-one platform to build a strong professional presence, showcase your projects, create an ATS-optimized resume, track your coding activity, connect with developers worldwide, and manage your tasks—all in one place.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            {isAuthenticated ? (
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<DashboardIcon />}
                                    onClick={() => navigate('/dashboard')}
                                    sx={styles.ctaButton}
                                >
                                    Go to Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate('/signup')}
                                        sx={styles.ctaButton}
                                    >
                                        Get Started Free
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/login')}
                                        sx={{ ...styles.ctaButton, boxShadow: 'none' }}
                                    >
                                        Sign In
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
                                border: '2px solid',
                                borderColor: 'primary.main'
                            }}
                        >
                            <Stack spacing={2}>
                                {[
                                    '✓ Create ATS-optimized resume with PDF export',
                                    '✓ Build comprehensive professional profile',
                                    '✓ Track coding activity with GitHub-style heatmap',
                                    '✓ Manage tasks with Kanban board',
                                    '✓ Share posts & connect with developers',
                                    '✓ Showcase projects, skills & certifications'
                                ].map((item, index) => (
                                    <Typography key={index} variant="h6" sx={{ fontWeight: 600 }}>
                                        {item}
                                    </Typography>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection;
