import React from 'react';
import { Box, Container, Typography, Button, Stack, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RocketLaunch as RocketIcon, PersonAdd as SignupIcon, Code as CodeIcon, TrendingUp as TrendingIcon, People as PeopleIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import LandingTerminalDemo from '../LandingTerminalDemo';

const TerminalShowcaseSection: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const styles = {
        section: {
            py: 10,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                pointerEvents: 'none'
            }
        },
        container: {
            position: 'relative',
            zIndex: 1
        },
        title: {
            fontWeight: 800,
            mb: 2,
            color: 'white',
            textAlign: 'center',
            fontSize: { xs: '2rem', md: '2.5rem' }
        },
        subtitle: {
            mb: 6,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            fontSize: { xs: '1rem', md: '1.25rem' },
            maxWidth: '800px',
            mx: 'auto'
        },
        contentGrid: {
            mb: 4
        },
        infoSection: {
            color: 'white'
        },
        infoTitle: {
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: '1.5rem', md: '2rem' },
            color: 'white'
        },
        featureBox: {
            mb: 3,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2
        },
        iconWrapper: {
            bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 48,
            minHeight: 48
        },
        featureContent: {
            flex: 1
        },
        featureTitle: {
            fontWeight: 600,
            mb: 0.5,
            fontSize: '1.1rem',
            color: 'white'
        },
        featureDesc: {
            color: 'rgba(255,255,255,0.85)',
            fontSize: '0.95rem',
            lineHeight: 1.6
        },
        terminalWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        ctaButtons: {
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        primaryButton: {
            px: 5,
            py: 1.8,
            fontSize: '1.1rem',
            fontWeight: 700,
            bgcolor: 'white',
            color: '#667eea',
            borderRadius: 3,
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                bgcolor: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.25)'
            },
            '&:active': {
                transform: 'translateY(0)'
            }
        },
        secondaryButton: {
            px: 5,
            py: 1.8,
            fontSize: '1.1rem',
            fontWeight: 700,
            bgcolor: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.8)',
            borderRadius: 3,
            textTransform: 'none',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
                borderColor: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            },
            '&:active': {
                transform: 'translateY(0)'
            }
        }
    };

    return (
        <Box sx={styles.section}>
            <Container maxWidth="lg" sx={styles.container}>
                <Typography variant="h2" sx={styles.title}>
                    Your Complete Developer Platform
                </Typography>
                <Typography variant="h6" sx={styles.subtitle}>
                    Everything you need to build, showcase, and grow your developer career in one place
                </Typography>

                {/* Two Column Layout */}
                <Grid container spacing={4} sx={styles.contentGrid}>
                    {/* Left: Platform Info */}
                    <Grid item xs={12} md={6}>
                        <Box sx={styles.infoSection}>
                            <Typography variant="h3" sx={styles.infoTitle}>
                                Why DevConnect?
                            </Typography>

                            <Box sx={styles.featureBox}>
                                <Box sx={styles.iconWrapper}>
                                    <CodeIcon sx={{ fontSize: 28, color: 'white' }} />
                                </Box>
                                <Box sx={styles.featureContent}>
                                    <Typography sx={styles.featureTitle}>
                                        Professional Portfolio
                                    </Typography>
                                    <Typography sx={styles.featureDesc}>
                                        Create a stunning developer profile that showcases your skills, projects, and experience. Stand out to recruiters and potential employers.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={styles.featureBox}>
                                <Box sx={styles.iconWrapper}>
                                    <TrendingIcon sx={{ fontSize: 28, color: 'white' }} />
                                </Box>
                                <Box sx={styles.featureContent}>
                                    <Typography sx={styles.featureTitle}>
                                        Track Your Growth
                                    </Typography>
                                    <Typography sx={styles.featureDesc}>
                                        Monitor your coding activity with GitHub-style heatmaps, track streaks, and visualize your progress over time.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={styles.featureBox}>
                                <Box sx={styles.iconWrapper}>
                                    <PeopleIcon sx={{ fontSize: 28, color: 'white' }} />
                                </Box>
                                <Box sx={styles.featureContent}>
                                    <Typography sx={styles.featureTitle}>
                                        Connect & Collaborate
                                    </Typography>
                                    <Typography sx={styles.featureDesc}>
                                        Join a thriving community of developers. Share knowledge, collaborate on projects, and grow your professional network.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right: Terminal Demo */}
                    <Grid item xs={12} md={6}>
                        <Box sx={styles.terminalWrapper}>
                            <LandingTerminalDemo />
                        </Box>
                    </Grid>
                </Grid>

                {/* CTA Buttons */}
                <Stack sx={styles.ctaButtons}>
                    {!user && (
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<SignupIcon />}
                            sx={styles.primaryButton}
                            onClick={() => navigate('/signup')}
                        >
                            Create Your Profile Now
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<RocketIcon />}
                        sx={styles.secondaryButton}
                        onClick={() => navigate('/documentation')}
                    >
                        Explore Features
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
};

export default TerminalShowcaseSection;
