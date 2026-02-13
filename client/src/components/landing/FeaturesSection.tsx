import React from 'react';
import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import {
    Description as ResumeIcon,
    Person as ProfileIcon,
    CalendarMonth as HeatmapIcon,
    Dashboard as BoardIcon,
    Forum as FeedIcon,
    Work as ProjectIcon
} from '@mui/icons-material';
import { getLandingColors } from '../../utils/landingTheme';

const FeaturesSection: React.FC = () => {
    const theme = useTheme();
    const colors = getLandingColors(theme);

    const features = [
        {
            icon: <ResumeIcon sx={{ fontSize: 40 }} />,
            title: 'ATS-Optimized Resume',
            description: 'Generate professional, job-ready resumes instantly from your developer profile.',
            color: colors.primary
        },
        {
            icon: <ProfileIcon sx={{ fontSize: 40 }} />,
            title: 'Comprehensive Identity',
            description: 'Your complete professional fingerprint: experience, stack, and certifications.',
            color: colors.secondary
        },
        {
            icon: <HeatmapIcon sx={{ fontSize: 40 }} />,
            title: 'Activity Analytics',
            description: 'Visualize your coding consistency with professional heatmaps and streak tracking.',
            color: colors.accent
        },
        {
            icon: <BoardIcon sx={{ fontSize: 40 }} />,
            title: 'Native Kanban',
            description: 'Stay focused with embedded task management built for developer workflows.',
            color: colors.accentAlt
        },
        {
            icon: <FeedIcon sx={{ fontSize: 40 }} />,
            title: 'Global Social Feed',
            description: 'Engage with the community, share knowledge, and build your professional network.',
            color: colors.primary
        },
        {
            icon: <ProjectIcon sx={{ fontSize: 40 }} />,
            title: 'Live Case Studies',
            description: 'Showcase your real-world contributions with deep repository integration.',
            color: colors.secondary
        }
    ];

    return (
        <Box id="features" sx={{ py: { xs: 8, md: 15 }, bgcolor: colors.bg, position: 'relative' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, color: colors.primary, letterSpacing: 4 }}>
                        ECOSYSTEM FEATURES
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: colors.text, mt: 2, mb: 3 }}>
                        Engineered for Engineers
                    </Typography>
                    <Typography variant="h6" sx={{ color: colors.textMuted, maxWidth: 800, mx: 'auto', fontWeight: 500 }}>
                        Every tool you need to architect your career and collaborate with colleagues in one unified platform.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box sx={{
                                height: '100%',
                                p: 4,
                                borderRadius: '32px',
                                border: `1px solid ${colors.border}`,
                                bgcolor: colors.bgCard,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    bgcolor: colors.bgCardHover,
                                    borderColor: colors.borderHover,
                                    boxShadow: `0 20px 40px ${colors.shadow}`
                                }
                            }}>
                                <Box sx={{ color: feature.color, mb: 3, display: 'flex' }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: colors.text, mb: 2 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.6, fontWeight: 500 }}>
                                    {feature.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeaturesSection;
