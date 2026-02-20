import React from 'react';
import { Box, Container, Typography, Grid, Stack, Link, Divider, IconButton, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
    LinkedIn as LinkedInIcon,
    GitHub as GitHubIcon,
    Twitter as TwitterIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getLandingColors } from '../../utils/landingTheme';
import Logo from '../common/Logo';

const LandingFooter: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const theme = useTheme();
    const colors = getLandingColors(theme);

    return (
        <Box sx={{
            bgcolor: colors.bg,
            color: colors.text,
            pt: 10,
            pb: 6,
            borderTop: `1px solid ${colors.border}`,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Subtle bottom glow */}
            <Box sx={{ position: 'absolute', bottom: '-5%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '20%', background: `radial-gradient(circle, ${colors.primary}0D 0%, transparent 70%)`, filter: 'blur(80px)', zIndex: 0 }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={8}>
                    {/* Brand Section */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <Logo color="white" />
                            <Typography sx={{ color: colors.textMuted, lineHeight: 1.8, maxWidth: 320 }}>
                                The elite professional ecosystem for global engineers. Build your identity, manage your growth, and connect with the best.
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                {[GitHubIcon, LinkedInIcon, TwitterIcon, EmailIcon].map((Icon, i) => (
                                    <IconButton key={i} sx={{
                                        bgcolor: colors.bgCard,
                                        color: colors.textSecondary,
                                        '&:hover': { bgcolor: `${colors.primary}1A`, color: colors.primary }
                                    }}>
                                        <Icon fontSize="small" />
                                    </IconButton>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Links Grid */}
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={4}>
                            <Grid item xs={6} sm={4}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#fff', mb: 3, letterSpacing: 1 }}>
                                    PLATFORM
                                </Typography>
                                <Stack spacing={2}>
                                    {isAuthenticated ? (
                                        <>
                                            <Link component={RouterLink} to="/dashboard" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Dashboard</Link>
                                            <Link component={RouterLink} to="/feed" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Social Feed</Link>
                                            <Link component={RouterLink} to="/board" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Task Board</Link>
                                            <Link component={RouterLink} to="/profile" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>My Profile</Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="#features" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Features</Link>
                                            <Link href="#about" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Vision</Link>
                                            <Link href="#how-it-works" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>How it Works</Link>
                                            <Link component={RouterLink} to="/documentation" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Docs</Link>
                                        </>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={6} sm={4}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#fff', mb: 3, letterSpacing: 1 }}>
                                    ACCOUNT
                                </Typography>
                                <Stack spacing={2}>
                                    {!isAuthenticated ? (
                                        <>
                                            <Link component={RouterLink} to="/login" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Login</Link>
                                            <Link component={RouterLink} to="/signup" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Sign Up</Link>
                                            <Link href="mailto:support@devconnect.com" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Support</Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link component={RouterLink} to="/settings" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Settings</Link>
                                            <Link component={RouterLink} to="/notifications" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Notifications</Link>
                                            <Link component={RouterLink} to="/messages" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}>Messages</Link>
                                        </>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#fff', mb: 3, letterSpacing: 1 }}>
                                    HEADQUARTERS
                                </Typography>
                                <Box sx={{
                                    width: '100%',
                                    height: 120,
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    opacity: 0.8,
                                    '&:hover': { opacity: 1 }
                                }}>
                                    <iframe
                                        title="FITNESS STUDIO Headquarters"
                                        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.7955797420777!2d82.83031028479296!3d24.93903288508543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398fb3a31d2d0f03%3A0x3880a314aaf28c29!2sSarthak%20Singh(prinsh)&#39;home!5e0!3m2!1sen!2sin!4v1770901618368!5m2!1sen!2sin'
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.05)' }} />

                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>
                        © {new Date().getFullYear()} D. Connect Ecosystem. All rights architectural.
                    </Typography>
                    <Stack direction="row" spacing={4}>
                        {[
                            { name: 'Privacy', path: '/privacy' },
                            { name: 'Terms', path: '/terms' },
                            { name: 'Security', path: '/security' },
                            { name: 'Status', path: '/status' }
                        ].map((link, i) => (
                            <Link
                                key={i}
                                component={RouterLink}
                                to={link.path}
                                sx={{
                                    color: '#94a3b8',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    '&:hover': { color: '#fff' }
                                }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default LandingFooter;
