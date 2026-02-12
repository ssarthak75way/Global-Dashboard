import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, useTheme } from '@mui/material';
import {
    Code as CodeIcon,
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    Security as SecurityIcon,
    Speed as SpeedIcon,
    Public as PublicIcon
} from '@mui/icons-material';

const FeaturesSection: React.FC = () => {
    const theme = useTheme();

    const features = [
        {
            icon: <CodeIcon sx={{ fontSize: 40 }} />,
            title: 'Activity Tracking',
            description: 'GitHub-style heatmap to visualize your coding journey and maintain streaks.'
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            title: 'Professional Networking',
            description: 'Connect with developers, share experiences, and grow your professional network.'
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            title: 'Profile Showcase',
            description: 'Build a comprehensive portfolio with projects, skills, and certifications.'
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: 'Secure & Private',
            description: 'Your data is protected with industry-standard security measures.'
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 40 }} />,
            title: 'Real-time Updates',
            description: 'Stay connected with instant notifications and live activity feeds.'
        },
        {
            icon: <PublicIcon sx={{ fontSize: 40 }} />,
            title: 'Global Community',
            description: 'Join developers from around the world in a vibrant tech community.'
        }
    ];

    const styles = {
        section: {
            py: { xs: 6, md: 12 }
        },
        sectionTitle: {
            fontWeight: 900,
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            mb: 2,
            textAlign: 'center'
        },
        sectionSubtitle: {
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            color: 'text.secondary',
            textAlign: 'center',
            mb: { xs: 4, md: 6 },
            maxWidth: 700,
            mx: 'auto'
        },
        featureCard: {
            height: '100%',
            p: 4,
            borderRadius: 3,
            transition: 'all 0.3s ease',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 40px ${theme.palette.primary.main}20`,
                borderColor: 'primary.main'
            }
        }
    };

    return (
        <Box id="features" sx={{ ...styles.section, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={styles.sectionTitle}>
                    Powerful Features
                </Typography>
                <Typography sx={styles.sectionSubtitle}>
                    Everything you need to build your developer brand and grow your career
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card elevation={0} sx={styles.featureCard}>
                                <CardContent>
                                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeaturesSection;
