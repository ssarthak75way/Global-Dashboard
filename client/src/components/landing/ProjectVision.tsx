import React from 'react';
import { Box, Container, Typography, Grid, Stack, useTheme } from '@mui/material';
import { RocketLaunch as RocketIcon, AutoFixHigh as MagicIcon, Security as SecurityIcon } from '@mui/icons-material';
import { getLandingColors } from '../../utils/landingTheme';

const ProjectVision: React.FC = () => {
    const theme = useTheme();
    const colors = getLandingColors(theme);

    return (
        <Box sx={{ py: { xs: 8, md: 15 }, bgcolor: colors.bg, position: 'relative' }}>
            <Container maxWidth="lg">
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'relative' }}>
                            <Box sx={{
                                width: '100%',
                                height: 500,
                                borderRadius: '40px',
                                background: `linear-gradient(135deg, ${colors.bgDark} 0%, ${colors.bgAlt} 100%)`,
                                border: `1px solid ${colors.border}`,
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
                                <Stack spacing={4} sx={{ position: 'relative', zIndex: 1, p: 4, textAlign: 'center' }}>
                                    <MagicIcon sx={{ fontSize: 80, color: colors.primary, mx: 'auto', filter: `drop-shadow(0 0 20px ${colors.primary}80)` }} />
                                    <Typography variant="h3" sx={{ fontWeight: 900, color: colors.text }}>
                                        Built by Devs,<br />For Devs.
                                    </Typography>
                                    <Typography sx={{ color: colors.textMuted, maxWidth: 400, mx: 'auto' }}>
                                        Our mission is to bridge the gap between social engagement and professional career growth in a single, elite workspace.
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="overline" sx={{ fontWeight: 900, color: colors.secondary, letterSpacing: 4 }}>
                            OUR VISION
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: colors.text, mt: 2, mb: 4 }}>
                            A Decentralized Professional Home
                        </Typography>
                        <Typography variant="h6" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 6, fontWeight: 500 }}>
                            We believe that a developer's career is more than just a list of jobs on a static business network. It's about constant learning, building projects, helping others, and showcasing your unique digital fingerprint.
                        </Typography>

                        <Stack spacing={4}>
                            {[
                                {
                                    icon: <RocketIcon sx={{ color: colors.primary }} />,
                                    title: 'Accelerated Growth',
                                    desc: 'Tools integrated directly into your workflow to help you ship faster and learn better.'
                                },
                                {
                                    icon: <SecurityIcon sx={{ color: colors.secondary }} />,
                                    title: 'Professional Security',
                                    desc: 'Own your professional data. Build a profile that serves you throughout your entire career.'
                                }
                            ].map((item, i) => (
                                <Stack key={i} direction="row" spacing={3} alignItems="flex-start">
                                    <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: colors.text, mb: 1 }}>{item.title}</Typography>
                                        <Typography sx={{ color: colors.textMuted }}>{item.desc}</Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ProjectVision;
