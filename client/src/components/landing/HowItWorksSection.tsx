import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack, useTheme } from '@mui/material';
import {
    PersonAdd as SignUpIcon,
    AccountCircle as ProfileIcon,
    People as ConnectIcon,
    TrendingUp as GrowIcon
} from '@mui/icons-material';

const HowItWorksSection: React.FC = () => {
    const theme = useTheme();

    const howItWorks = [
        {
            step: '01',
            icon: <SignUpIcon sx={{ fontSize: 50, color: 'white' }} />,
            title: 'Sign Up Free',
            description: 'Create your account in seconds with email verification. No credit card required, completely free forever.'
        },
        {
            step: '02',
            icon: <ProfileIcon sx={{ fontSize: 50, color: 'white' }} />,
            title: 'Build Your Profile',
            description: 'Add your work experience, education, projects, skills, and certifications. This creates your professional online presence.'
        },
        {
            step: '03',
            icon: <ConnectIcon sx={{ fontSize: 50, color: 'white' }} />,
            title: 'Create & Connect',
            description: 'Build your resume, manage tasks on your board, post updates, and connect with developers worldwide.'
        },
        {
            step: '04',
            icon: <GrowIcon sx={{ fontSize: 50, color: 'white' }} />,
            title: 'Track & Grow',
            description: 'Monitor your activity with the heatmap, view analytics, maintain streaks, and watch your professional brand grow.'
        }
    ];

    const styles = {
        section: {
            py: { xs: 8, md: 12 }
        },
        sectionTitle: {
            fontWeight: 900,
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 2,
            textAlign: 'center'
        },
        sectionSubtitle: {
            fontSize: '1.1rem',
            color: 'text.secondary',
            textAlign: 'center',
            mb: 6,
            maxWidth: 700,
            mx: 'auto'
        },
        stepCard: {
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            position: 'relative',
            height: '100%',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-8px)'
            }
        },
        stepNumber: {
            position: 'absolute',
            top: -20,
            left: 20,
            bgcolor: 'background.paper',
            color: 'primary.main',
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.5rem',
            border: '4px solid',
            borderColor: 'primary.main'
        }
    };

    return (
        <Box id="how-it-works" sx={{ ...styles.section, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={styles.sectionTitle}>
                    How to Get Started
                </Typography>
                <Typography sx={styles.sectionSubtitle}>
                    Start building your professional presence in four simple steps
                </Typography>
                <Grid container spacing={4}>
                    {howItWorks.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper elevation={4} sx={styles.stepCard}>
                                <Box sx={styles.stepNumber}>{item.step}</Box>
                                <Stack spacing={2} sx={{ mt: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        {item.icon}
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{ textAlign: 'center', opacity: 0.95 }}>
                                        {item.description}
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default HowItWorksSection;
