import React from 'react';
import { Box, Container, Typography, Grid, Stack, Link, Divider, IconButton, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
    LinkedIn as LinkedInIcon,
    GitHub as GitHubIcon,
    Twitter as TwitterIcon,
    Email as EmailIcon
} from '@mui/icons-material';

const LandingFooter: React.FC = () => {
    const theme = useTheme();

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
        }
    };

    return (
        <Box sx={styles.footer}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
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
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Empowering developers to build, connect, and grow together.
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
                                <GitHubIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{ bgcolor: 'action.hover' }}
                                component="a"
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{ bgcolor: 'action.hover' }}
                                component="a"
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <TwitterIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{ bgcolor: 'action.hover' }}
                                component="a"
                                href="mailto:contact@devconnect.com"
                            >
                                <EmailIcon />
                            </IconButton>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Platform
                        </Typography>
                        <Stack spacing={1}>
                            <Link component={RouterLink} to="/dashboard" color="text.secondary" underline="hover" sx={styles.link}>
                                Dashboard
                            </Link>
                            <Link component={RouterLink} to="/feed" color="text.secondary" underline="hover" sx={styles.link}>
                                Social Feed
                            </Link>
                            <Link component={RouterLink} to="/board" color="text.secondary" underline="hover" sx={styles.link}>
                                Task Board
                            </Link>
                            <Link component={RouterLink} to="/profile" color="text.secondary" underline="hover" sx={styles.link}>
                                Profile
                            </Link>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Features
                        </Typography>
                        <Stack spacing={1}>
                            <Link component={RouterLink} to="/resume" color="text.secondary" underline="hover" sx={styles.link}>
                                Resume Builder
                            </Link>
                            <Link href="#features" color="text.secondary" underline="hover" sx={styles.link}>
                                All Features
                            </Link>
                            <Link href="#how-it-works" color="text.secondary" underline="hover" sx={styles.link}>
                                How It Works
                            </Link>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Resources
                        </Typography>
                        <Stack spacing={1}>
                            <Link component={RouterLink} to="/documentation" color="text.secondary" underline="hover" sx={styles.link}>
                                Documentation
                            </Link>
                            <Link href="#about" color="text.secondary" underline="hover" sx={styles.link}>
                                About Us
                            </Link>
                            <Link href="#support" color="text.secondary" underline="hover" sx={styles.link}>
                                Support
                            </Link>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Account
                        </Typography>
                        <Stack spacing={1}>
                            <Link component={RouterLink} to="/login" color="text.secondary" underline="hover" sx={styles.link}>
                                Login
                            </Link>
                            <Link component={RouterLink} to="/signup" color="text.secondary" underline="hover" sx={styles.link}>
                                Sign Up
                            </Link>
                            <Link component="a" href="mailto:support@devconnect.com" color="text.secondary" underline="hover" sx={styles.link}>
                                Contact
                            </Link>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4 }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} DevConnect. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Link href="#" color="text.secondary" underline="hover" sx={{ ...styles.link, fontSize: '0.875rem' }}>
                            Privacy Policy
                        </Link>
                        <Link href="#" color="text.secondary" underline="hover" sx={{ ...styles.link, fontSize: '0.875rem' }}>
                            Terms of Service
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default LandingFooter;
