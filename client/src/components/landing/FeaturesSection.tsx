import React from 'react';
import { Box, Container, Typography, Grid, useTheme, Paper, alpha } from '@mui/material';
import {
    Description as ResumeIcon,
    Person as ProfileIcon,
    CalendarMonth as HeatmapIcon,
    Dashboard as BoardIcon,
    Forum as FeedIcon,
    Work as ProjectIcon
} from '@mui/icons-material';

const FeaturesSection: React.FC = () => {
    const theme = useTheme();

    const features = [
        {
            icon: <ResumeIcon sx={{ fontSize: 32 }} />,
            title: 'ATS-Optimized Resumes',
            description: 'Generate expert resumes instantly. Export to PDF with a single click.',
            color: '#6366f1',
            colSpan: { xs: 12, md: 8 }
        },
        {
            icon: <HeatmapIcon sx={{ fontSize: 32 }} />,
            title: 'Activity Heatmaps',
            description: 'Visualize your coding consistency.',
            color: '#10b981',
            colSpan: { xs: 12, md: 4 }
        },
        {
            icon: <BoardIcon sx={{ fontSize: 32 }} />,
            title: 'Kanban Workflow',
            description: 'Manage tasks with a native drag-and-drop board.',
            color: '#f59e0b',
            colSpan: { xs: 12, md: 4 }
        },
        {
            icon: <ProfileIcon sx={{ fontSize: 32 }} />,
            title: 'Developer Identity',
            description: 'Showcase your tech stack, experience, and projects in one unified profile.',
            color: '#ec4899',
            colSpan: { xs: 12, md: 8 }
        },
        {
            icon: <FeedIcon sx={{ fontSize: 32 }} />,
            title: 'Community Feed',
            description: 'Share knowledge, get feedback, and connect with peers.',
            color: '#8b5cf6',
            colSpan: { xs: 12, md: 6 }
        },
        {
            icon: <ProjectIcon sx={{ fontSize: 32 }} />,
            title: 'Project Showcase',
            description: 'Deep integration with your repositories.',
            color: '#06b6d4',
            colSpan: { xs: 12, md: 6 }
        }
    ];

    return (
        <Box id="features" sx={{
            py: { xs: 10, md: 16 },
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography
                        variant="overline"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: 3,
                            color: 'primary.main',
                            mb: 2,
                            display: 'block'
                        }}
                    >
                        POWERFUL TOOLS
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            mb: 3,
                            fontSize: { xs: '2rem', md: '3.5rem' }
                        }}
                    >
                        Everything you need to <br />
                        <Box component="span" sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            accelerate your career
                        </Box>
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 700,
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        A comprehensive suite of tools designed specifically for modern developers to manage their growth and professional presence.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item key={index} {...feature.colSpan}>
                            <Paper
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    p: { xs: 3, md: 4 },
                                    borderRadius: 4,
                                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 20px 40px -10px ${alpha(feature.color, 0.2)}`,
                                        borderColor: alpha(feature.color, 0.3),
                                        '& .icon-box': {
                                            transform: 'scale(1.1) rotate(5deg)',
                                            bgcolor: alpha(feature.color, 0.2)
                                        }
                                    }
                                }}
                            >
                                <Box
                                    className="icon-box"
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: alpha(feature.color, 0.1),
                                        color: feature.color,
                                        mb: 3,
                                        transition: 'all 0.4s ease'
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                    {feature.description}
                                </Typography>

                                {/* Decorative Background Elements */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: 150,
                                    height: 150,
                                    background: `radial-gradient(circle at top right, ${alpha(feature.color, 0.1)} 0%, transparent 70%)`,
                                    zIndex: 0
                                }} />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeaturesSection;
