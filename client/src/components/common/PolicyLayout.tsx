import React, { ReactNode } from 'react';
import { Box, Container, Typography, Fade, IconButton, Stack, alpha, useTheme } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../PublicNavbar';
import LandingFooter from '../landing/LandingFooter';

interface PolicyLayoutProps {
    title: string;
    description?: string;
    children: ReactNode;
    lastUpdated?: string;
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ title, description, children, lastUpdated }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <PublicNavbar />

            <Box sx={{ flexGrow: 1, pt: { xs: 12, md: 16 }, pb: 10 }}>
                <Container maxWidth="md">
                    <Fade in timeout={800}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                                <IconButton
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                    }}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}>
                                    D. CONNECT ECOSYSTEM
                                </Typography>
                            </Stack>

                            <Typography variant="h1" sx={{
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                fontWeight: 800,
                                mb: 2,
                                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.7)} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {title}
                            </Typography>

                            {description && (
                                <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, fontWeight: 400, lineHeight: 1.6 }}>
                                    {description}
                                </Typography>
                            )}

                            {lastUpdated && (
                                <Typography variant="body2" sx={{ color: 'text.disabled', mb: 6 }}>
                                    Last updated: {lastUpdated}
                                </Typography>
                            )}

                            <Box sx={{
                                p: { xs: 3, md: 6 },
                                borderRadius: '24px',
                                bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#fff',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid',
                                borderColor: alpha(theme.palette.divider, 0.1),
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 20px 50px rgba(0,0,0,0.3)'
                                    : '0 20px 50px rgba(99, 102, 241, 0.05)',
                                '& h2': {
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    mt: 6,
                                    mb: 3,
                                    color: 'text.primary'
                                },
                                '& h3': {
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    mt: 4,
                                    mb: 2,
                                    color: 'text.primary'
                                },
                                '& p': {
                                    lineHeight: 1.8,
                                    color: 'text.secondary',
                                    mb: 3
                                },
                                '& ul': {
                                    pl: 3,
                                    mb: 3,
                                    '& li': {
                                        color: 'text.secondary',
                                        mb: 1.5,
                                        lineHeight: 1.6
                                    }
                                }
                            }}>
                                {children}
                            </Box>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            <LandingFooter />
        </Box>
    );
};

export default PolicyLayout;
