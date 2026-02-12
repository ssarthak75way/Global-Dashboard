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

const LandingFooter: React.FC = () => {
    const theme = useTheme();
    const { isAuthenticated } = useAuth();

    const styles = {
        footer: {
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            py: 6,
            mt: 8
        },
        link: {
            cursor: 'pointer',
            transition: 'color 0.2s',
            '&:hover': {
                color: 'primary.main'
            }
        },
        mapContainer: {
            width: '100%',
            height: '150px',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }
    };

    return (
        <Box sx={styles.footer}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 900,
                                    color: 'white'
                                }}
                            >
                                D
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                DevConnect
                            </Typography>
                        </Stack>
                        <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                            Empowering developers to build, connect, and grow together in a professional ecosystem.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                size="small"
                                sx={{ bgcolor: 'action.hover' }}
                                component="a"
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GitHubIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{ bgcolor: 'action.hover' }}
                                component="a"
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <LinkedInIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{ bgcolor: 'action.hover' }}
                                component="a"
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <TwitterIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{ bgcolor: 'action.hover' }}
                                component="a"
                                href="mailto:contact@devconnect.com"
                            >
                                <EmailIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                            Platform
                        </Typography>
                        <Stack spacing={1}>
                            <Link component={RouterLink} to="/dashboard" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                Dashboard
                            </Link>
                            <Link component={RouterLink} to="/feed" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                Social Feed
                            </Link>
                            <Link component={RouterLink} to="/board" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                Task Board
                            </Link>
                            <Link component={RouterLink} to="/profile" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                Profile
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                            Resources
                        </Typography>
                        <Stack spacing={1}>
                            <Link component={RouterLink} to="/documentation" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                Documentation
                            </Link>
                            <Link href="#about" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                About Us
                            </Link>
                            <Link href="#support" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                Support
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                            Account
                        </Typography>
                        <Stack spacing={1}>
                            {!isAuthenticated ? (
                                <>
                                    <Link component={RouterLink} to="/login" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                        Login
                                    </Link>
                                    <Link component={RouterLink} to="/signup" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                        Sign Up
                                    </Link>
                                    <Link component="a" href="mailto:support@devconnect.com" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                        Contact
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link component={RouterLink} to="/settings" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                        Settings
                                    </Link>
                                    <Link component={RouterLink} to="/notifications" color="text.secondary" variant="body2" underline="hover" sx={styles.link}>
                                        Notifications
                                    </Link>
                                </>
                            )}
                        </Stack>
                    </Grid>

                    {/* Location Map Section */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                            Our Location
                        </Typography>
                        <Box sx={styles.mapContainer}>
                            <iframe
                              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.7955797420777!2d82.83031028479296!3d24.93903288508543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398fb3a31d2d0f03%3A0x3880a314aaf28c29!2sSarthak%20Singh(prinsh)&#39;home!5e0!3m2!1sen!2sin!4v1770901618368!5m2!1sen!2sin'
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} DevConnect. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={3}>
                        <Link href="#" color="text.secondary" underline="hover" sx={{ ...styles.link, fontSize: '0.85rem' }}>
                            Privacy Policy
                        </Link>
                        <Link href="#" color="text.secondary" underline="hover" sx={{ ...styles.link, fontSize: '0.85rem' }}>
                            Terms of Service
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default LandingFooter;
