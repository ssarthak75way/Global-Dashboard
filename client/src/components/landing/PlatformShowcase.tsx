import React from 'react';
import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import {
    Person as IdentityIcon,
    Speed as ProductivityIcon,
    AutoGraph as GrowthIcon,
    Groups as CommunityIcon
} from '@mui/icons-material';
import { getLandingColors } from '../../utils/landingTheme';

const PlatformShowcase: React.FC = () => {
    const theme = useTheme();
    const colors = getLandingColors(theme);

    const showcases = [
        {
            icon: <IdentityIcon sx={{ fontSize: 40 }} />,
            title: 'Professional Identity',
            description: 'Your developer profile redefined. Showcase your tech stack, projects, and achievements in a cinematic interface.',
            color: colors.primary
        },
        {
            icon: <ProductivityIcon sx={{ fontSize: 40 }} />,
            title: 'Seamless Productivity',
            description: 'A native Kanban system designed for developers. Manage your sprints and tasks without leaving the platform.',
            color: colors.secondary
        },
        {
            icon: <GrowthIcon sx={{ fontSize: 40 }} />,
            title: 'Intelligent Growth',
            description: 'Track your coding streaks and contribution activity with advanced heatmaps and engagement analytics.',
            color: colors.accent
        },
        {
            icon: <CommunityIcon sx={{ fontSize: 40 }} />,
            title: 'Developer Ecosystem',
            description: 'Connect with elite engineers worldwide. Share insights, collaborative projects, and expand your professional orbit.',
            color: colors.accentAlt
        }
    ];

    return (
        <Box sx={{ py: { xs: 8, md: 15 }, bgcolor: colors.bgAlt, color: colors.text, position: 'relative', overflow: 'hidden' }}>
            {/* Background Accents */}
            <Box sx={{ position: 'absolute', top: '10%', right: '-5%', width: 400, height: 400, background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 70%)`, filter: 'blur(100px)' }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, color: colors.primary, letterSpacing: 4 }}>
                        PLATFORM CORE
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 900, mt: 2, mb: 3, background: `linear-gradient(to bottom, ${colors.text}, ${colors.textSecondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        The Developer Ecosystem
                    </Typography>
                    <Typography variant="h6" sx={{ color: colors.textMuted, maxWidth: 700, mx: 'auto', fontWeight: 500 }}>
                        DevConnect combines career management, productivity tools, and social networking into one unified workspace.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {showcases.map((item, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Box sx={{
                                height: '100%',
                                p: 4,
                                borderRadius: '32px',
                                border: `1px solid ${colors.border}`,
                                bgcolor: colors.bgCard,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    bgcolor: colors.bgCardHover,
                                    borderColor: `${item.color}40`,
                                    boxShadow: `0 20px 40px ${item.color}15`
                                }
                            }}>
                                <Box sx={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: '20px',
                                    bgcolor: `${item.color}10`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: item.color,
                                    mb: 4,
                                    boxShadow: `0 0 20px ${item.color}20`
                                }}>
                                    {item.icon}
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: colors.text }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.7, fontWeight: 500 }}>
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

export default PlatformShowcase;
