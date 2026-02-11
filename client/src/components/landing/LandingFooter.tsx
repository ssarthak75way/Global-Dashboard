import React from 'react';
import { Box, Container, Typography, Grid, Stack, Link, Divider, IconButton, useTheme } from '@mui/material';
import {
    LinkedIn as LinkedInIcon,
    GitHub as GitHubIcon,
    Twitter as TwitterIcon
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
                            <IconButton size="small" sx={{ bgcolor: 'action.hover' }}>
                                <GitHubIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: 'action.hover' }}>
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: 'action.hover' }}>
                                <TwitterIcon />
                            </IconButton>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Product
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#features" color="text.secondary" underline="hover">Features</Link>
                            <Link href="#" color="text.secondary" underline="hover">Pricing</Link>
                            <Link href="#" color="text.secondary" underline="hover">Updates</Link>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Company
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#about" color="text.secondary" underline="hover">About</Link>
                            <Link href="#" color="text.secondary" underline="hover">Blog</Link>
                            <Link href="#" color="text.secondary" underline="hover">Careers</Link>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Resources
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#support" color="text.secondary" underline="hover">Support</Link>
                            <Link href="#" color="text.secondary" underline="hover">Documentation</Link>
                            <Link href="#" color="text.secondary" underline="hover">Community</Link>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Legal
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="text.secondary" underline="hover">Privacy</Link>
                            <Link href="#" color="text.secondary" underline="hover">Terms</Link>
                            <Link href="#" color="text.secondary" underline="hover">Security</Link>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4 }} />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    © {new Date().getFullYear()} DevConnect. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default LandingFooter;
