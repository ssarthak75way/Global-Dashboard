import React from 'react';
import { Box, Container, Typography, Button, Grid, Stack, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
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
            fontSize: { xs: '2.5rem', md: '4rem' },
            lineHeight: 1.2,
            mb: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        },
        heroSubtitle: {
            fontSize: { xs: '1.1rem', md: '1.4rem' },
            color: 'text.secondary',
            mb: 4,
            maxWidth: 600
        },
        ctaButton: {
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
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
                            Connect, Code, Collaborate
                        </Typography>
                        <Typography sx={styles.heroSubtitle}>
                            Join the ultimate platform for developers to showcase their work, track their progress, and connect with a global community of tech enthusiasts.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
                                    '✓ Track your coding activity',
                                    '✓ Build your professional profile',
                                    '✓ Connect with developers',
                                    '✓ Showcase your projects',
                                    '✓ Join a global community'
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
