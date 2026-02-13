import React from 'react';
import { Box, Container, Typography, Grid, Stack, Paper, useTheme } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { getLandingColors } from '../../utils/landingTheme';

const AboutSection: React.FC = () => {
    const theme = useTheme();
    const colors = getLandingColors(theme);

    const styles = {
        section: {
            py: { xs: 8, md: 15 },
            bgcolor: colors.bg
        },
        sectionTitle: {
            fontWeight: 900,
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            mb: 2,
            textAlign: 'center',
            color: colors.text
        }
    };

    return (
        <Box id="about" sx={styles.section}>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" sx={{ ...styles.sectionTitle, textAlign: 'left' }}>
                            What is DevConnect?
                        </Typography>
                        <Typography sx={{ fontSize: '1.1rem', color: colors.textSecondary, mb: 3 }}>
                            DevConnect is your complete professional platform designed specifically for developers. Whether you're a student, freelancer, or experienced professional, DevConnect helps you establish a strong online presence and manage your career growth.
                        </Typography>
                        <Typography sx={{ fontSize: '1.1rem', color: colors.textSecondary, mb: 3 }}>
                            <strong style={{ color: colors.text }}>What you get:</strong> A professional profile that showcases your skills and experience, an ATS-optimized resume builder for job applications, a task management system to stay organized, social features to network with developers, and analytics to track your growth.
                        </Typography>
                        <Stack spacing={2}>
                            {[
                                'All-in-one platform for developers',
                                'Build strong professional presence online',
                                'Create job-ready resumes in minutes',
                                'Track your coding journey & progress',
                                'Connect with global developer community',
                                'Completely free to use'
                            ].map((item, index) => (
                                <Stack key={index} direction="row" spacing={2} alignItems="center">
                                    <CheckIcon color="primary" />
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: colors.text }}>{item}</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                color: 'white'
                            }}
                        >
                            <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, textAlign: 'center' }}>
                                How to Use DevConnect
                            </Typography>

                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        1. Create Your Profile
                                    </Typography>
                                    <Typography variant="body2">
                                        Sign up and fill in your work experience, education, projects, skills, and certifications. This becomes your professional portfolio.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        2. Build Your Resume
                                    </Typography>
                                    <Typography variant="body2">
                                        Use the Resume Builder to create an ATS-optimized resume. Your profile data auto-fills the resume. Export as PDF for job applications.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        3. Track Your Activity
                                    </Typography>
                                    <Typography variant="body2">
                                        Post updates about your projects and learning. Your activity appears on the heatmap, helping you maintain consistency and build streaks.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        4. Manage Tasks
                                    </Typography>
                                    <Typography variant="body2">
                                        Use the Kanban board to organize your tasks. Create, drag, and track your work across To Do, In Progress, and Done columns.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        5. Network & Grow
                                    </Typography>
                                    <Typography variant="body2">
                                        Follow other developers, engage with their posts, share your achievements, and build your professional network.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AboutSection;
