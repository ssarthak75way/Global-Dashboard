import React from 'react';
import { Box, Container, Typography, Grid, Button, Stack, useTheme } from '@mui/material';
import { Verified as VerifiedIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getLandingColors } from '../../utils/landingTheme';

const DevCardHighlight: React.FC = () => {
    const theme = useTheme();
    const colors = getLandingColors(theme);

    return (
        <Box sx={{ py: { xs: 8, md: 15 }, bgcolor: colors.bgAlt, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', bottom: '-10%', left: '10%', width: 500, height: 500, background: `radial-gradient(circle, ${colors.secondary}1A 0%, transparent 70%)`, filter: 'blur(100px)' }} />

            <Container maxWidth="lg">
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="overline" sx={{ fontWeight: 900, color: colors.primary, letterSpacing: 4 }}>
                            DIGITAL IDENTITY
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: colors.text, mt: 2, mb: 4 }}>
                            The Ultimate <br />Developer Card
                        </Typography>
                        <Typography variant="h6" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 6, fontWeight: 500 }}>
                            Generate an ultra-premium, landscape developer card that showcases your global rank, top projects, and professional connectivity. Share your digital fingerprints anywhere.
                        </Typography>

                        <Stack direction="row" spacing={3}>
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                startIcon={<VerifiedIcon />}
                                sx={{
                                    borderRadius: '20px',
                                    px: 4,
                                    py: 2,
                                    fontWeight: 900,
                                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                                    color: 'white',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 25px rgba(99,102,241,0.4)' }
                                }}
                            >
                                Claim Your Identity
                            </Button>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            position: 'relative',
                            perspective: '1500px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            {/* Decorative Mockup version of the card */}
                            <Box sx={{
                                width: '100%',
                                maxWidth: 550,
                                height: 350,
                                background: '#0a0a0c',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                transform: 'rotateY(-20deg) rotateX(10deg)',
                                boxShadow: '-20px 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(99,102,241,0.1)',
                                transition: 'all 0.5s ease',
                                '&:hover': {
                                    transform: 'rotateY(-10deg) rotateX(5deg) translateY(-10px)',
                                    boxShadow: '-30px 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.2)'
                                },
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Box sx={{ position: 'absolute', inset: 0, background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")', opacity: 0.1 }} />

                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ width: 24, height: 24, borderRadius: '6px', background: 'linear-gradient(45deg, #6366f1, #a855f7)' }} />
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'white', letterSpacing: 1 }}>DEVCONNECT</Typography>
                                    </Stack>
                                    <Box sx={{ px: 1, py: 0.1, borderRadius: 4, bgcolor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#818cf8', fontSize: '10px' }}>PRO</Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                    <Box sx={{ width: 70, height: 70, borderRadius: '50%', border: `2px solid ${colors.primary}`, p: '2px' }}>
                                        <Box sx={{ width: '100%', height: '100%', borderRadius: '50%', bgcolor: colors.bgDarker }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ color: colors.text, fontWeight: 900 }}>Elite Developer</Typography>
                                        <Typography variant="caption" sx={{ color: colors.textMuted }}>Full Stack Architect</Typography>
                                    </Box>
                                </Stack>

                                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                                    {[105, 12, 45].map((val, i) => (
                                        <Grid item xs={4} key={i}>
                                            <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#fff' }}>{val}</Typography>
                                                <Typography variant="caption" sx={{ fontSize: '8px', color: '#64748b', fontWeight: 900 }}>METRIC</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Box sx={{ mt: 'auto', p: 1.5, bgcolor: colors.bgDark, borderRadius: '12px', border: `1px solid ${colors.border}` }}>
                                    <Typography variant="caption" sx={{ color: colors.textLight, fontSize: '9px', fontWeight: 900, letterSpacing: 1 }}>GEN-ID: 75WAY-DB03-PRO</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default DevCardHighlight;
