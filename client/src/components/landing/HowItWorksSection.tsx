import React from 'react';
import { Box, Container, Typography, Grid, useTheme } from '@mui/material';

const HowItWorksSection: React.FC = () => {
    const theme = useTheme();

    const howItWorks = [
        { step: '01', title: 'Sign Up', description: 'Create your account in seconds with email verification.' },
        { step: '02', title: 'Build Profile', description: 'Showcase your skills, projects, and experience.' },
        { step: '03', title: 'Connect', description: 'Network with developers and join discussions.' },
        { step: '04', title: 'Grow', description: 'Track your progress and achieve your goals.' }
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
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
            border: '2px solid',
            borderColor: 'primary.main',
            position: 'relative'
        },
        stepNumber: {
            position: 'absolute',
            top: -20,
            left: 20,
            bgcolor: 'primary.main',
            color: 'white',
            width: 50,
            height: 50,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.2rem'
        }
    };

    return (
        <Box id="how-it-works" sx={{ ...styles.section, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={styles.sectionTitle}>
                    How It Works
                </Typography>
                <Typography sx={styles.sectionSubtitle}>
                    Get started in four simple steps
                </Typography>
                <Grid container spacing={4}>
                    {howItWorks.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Box sx={styles.stepCard}>
                                <Box sx={styles.stepNumber}>{item.step}</Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, mt: 2 }}>
                                    {item.title}
                                </Typography>
                                <Typography color="text.secondary">
                                    {item.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default HowItWorksSection;
