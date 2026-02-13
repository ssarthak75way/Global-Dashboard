import React from 'react';
import { Box, Container, Typography, Grid, Stack, useTheme } from '@mui/material';
import {
    PersonAdd as SignUpIcon,
    Fingerprint as IdentityIcon,
    Construction as BuildIcon,
    Share as DeployIcon
} from '@mui/icons-material';
import { getLandingColors } from '../../utils/landingTheme';

const HowItWorksSection: React.FC = () => {
    const theme = useTheme();
    const colors = getLandingColors(theme);

    const steps = [
        {
            number: '01',
            icon: <SignUpIcon sx={{ fontSize: 32 }} />,
            title: 'Create Identity',
            description: 'Initialize your developer node. No credit cards, just your passion for engineering.',
            color: colors.primary
        },
        {
            number: '02',
            icon: <IdentityIcon sx={{ fontSize: 32 }} />,
            title: 'Sync Profile',
            description: 'Import your tech stack, certifications, and experience to build your digital fingerprint.',
            color: colors.secondary
        },
        {
            number: '03',
            icon: <BuildIcon sx={{ fontSize: 32 }} />,
            title: 'Forge Documents',
            description: 'Instantly generate professional ATS-ready resumes and your elite landscape Dev Card.',
            color: colors.accent
        },
        {
            number: '04',
            icon: <DeployIcon sx={{ fontSize: 32 }} />,
            title: 'Deploy Globally',
            description: 'Share your verified profile with the world and connect with the global developer network.',
            color: colors.accentAlt
        }
    ];

    return (
        <Box id="how-it-works" sx={{ py: { xs: 8, md: 15 }, bgcolor: colors.bg, position: 'relative' }}>
            {/* Background Ambient Glow */}
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 70%)`, filter: 'blur(100px)', zIndex: 0 }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, color: colors.primary, letterSpacing: 4 }}>
                        DEPLOYMENT LIFECYCLE
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: colors.text, mt: 2, mb: 3 }}>
                        How to Get Started
                    </Typography>
                    <Typography variant="h6" sx={{ color: colors.textMuted, maxWidth: 700, mx: 'auto', fontWeight: 500 }}>
                        Join the elite developer community in four simple, high-impact steps.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {steps.map((step, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Box sx={{
                                position: 'relative',
                                height: '100%',
                                p: 5,
                                borderRadius: '32px',
                                bgcolor: colors.bgAlt,
                                border: `1px solid ${colors.border}`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    borderColor: `${step.color}40`,
                                    boxShadow: `0 20px 40px ${step.color}15`
                                }
                            }}>
                                {/* Floating Number */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: -25,
                                    left: 40,
                                    width: 50,
                                    height: 50,
                                    borderRadius: '15px',
                                    bgcolor: colors.bgDark,
                                    border: `2px solid ${step.color}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: step.color,
                                    fontWeight: 900,
                                    fontSize: '1.2rem',
                                    boxShadow: `0 10px 20px ${step.color}25`
                                }}>
                                    {step.number}
                                </Box>

                                <Stack spacing={3} sx={{ mt: 2 }}>
                                    <Box sx={{ color: step.color, display: 'flex' }}>
                                        {step.icon}
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: colors.text }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.7, fontWeight: 500 }}>
                                        {step.description}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default HowItWorksSection;
