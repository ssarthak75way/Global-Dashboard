import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, useTheme } from '@mui/material';
import {
    Description as ResumeIcon,
    Person as ProfileIcon,
    CalendarMonth as HeatmapIcon,
    Dashboard as BoardIcon,
    Forum as FeedIcon,
    Work as ProjectIcon,
    School as SkillIcon,
    CardMembership as CertIcon,
    TrendingUp as ActivityIcon
} from '@mui/icons-material';

const FeaturesSection: React.FC = () => {
    const theme = useTheme();

    const features = [
        {
            icon: <ResumeIcon sx={{ fontSize: 40 }} />,
            title: 'ATS-Optimized Resume Builder',
            description: 'Create professional, ATS-friendly resumes with our easy-to-use builder. Fill in your details once and export to PDF instantly. Perfect for job applications.'
        },
        {
            icon: <ProfileIcon sx={{ fontSize: 40 }} />,
            title: 'Comprehensive Profile',
            description: 'Build your complete professional profile with work experience, education, projects, skills, and certifications. Make your online presence strong and discoverable.'
        },
        {
            icon: <HeatmapIcon sx={{ fontSize: 40 }} />,
            title: 'Activity Tracking',
            description: 'Track your coding journey with a GitHub-style activity heatmap. Visualize your consistency, maintain streaks, and see your progress over time.'
        },
        {
            icon: <BoardIcon sx={{ fontSize: 40 }} />,
            title: 'Task Management Board',
            description: 'Organize your work with a powerful Kanban board. Create tasks, drag-and-drop between columns (To Do, In Progress, Done), and stay productive.'
        },
        {
            icon: <FeedIcon sx={{ fontSize: 40 }} />,
            title: 'Social Feed & Networking',
            description: 'Share your thoughts, projects, and achievements. Like, comment, and engage with posts from developers worldwide. Build your professional network.'
        },
        {
            icon: <ProjectIcon sx={{ fontSize: 40 }} />,
            title: 'Project Showcase',
            description: 'Display your projects with descriptions, tech stacks, live links, and GitHub repositories. Let recruiters and peers see what you\'ve built.'
        },
        {
            icon: <SkillIcon sx={{ fontSize: 40 }} />,
            title: 'Skills & Expertise',
            description: 'List all your technical skills, programming languages, frameworks, and tools. Organize them by proficiency to highlight your strengths.'
        },
        {
            icon: <CertIcon sx={{ fontSize: 40 }} />,
            title: 'Certifications & Achievements',
            description: 'Showcase your certifications, courses, and professional achievements. Add credential IDs and links to verify your accomplishments.'
        },
        {
            icon: <ActivityIcon sx={{ fontSize: 40 }} />,
            title: 'Analytics Dashboard',
            description: 'Get insights into your activity with detailed analytics. Track posts, followers, following, projects, and overall engagement metrics.'
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
            maxWidth: 800,
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
                    Everything You Need in One Platform
                </Typography>
                <Typography sx={styles.sectionSubtitle}>
                    DevConnect provides all the tools you need to build your professional brand, manage your work, and connect with the global developer community
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
