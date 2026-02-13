import React from 'react';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';

const CTASection: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    const styles = {
        section: {
            py: { xs: 8, md: 12 }
        },
        ctaButton: {
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 700,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: `0 8px 24px ${theme.palette.primary.main}40`
        }
    };

    return (
        <Box sx={{ ...styles.section, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
            <Container maxWidth="md">
                <Typography variant="h2" sx={{ fontWeight: 900, mb: 3 }}>
                    Ready to Start Your Journey?
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                    Join thousands of developers already using DevConnect
                </Typography>
                {isAuthenticated ? (
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<DashboardIcon />}
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            ...styles.ctaButton,
                            bgcolor: 'white !important',
                            color: '#000',
                            '&:hover': {
                                bgcolor: 'grey.100'
                            }
                        }}
                    >
                        Go to Dashboard
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/signup')}
                        sx={{
                            ...styles.ctaButton,
                            bgcolor: 'white !important',
                            color: '#000',
                            '&:hover': {
                                bgcolor: 'grey.100'
                            }
                        }}
                    >
                        Create Free Account
                    </Button>
                )}
            </Container>
        </Box>
    );
};

export default CTASection;
