import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Link, useTheme } from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Code as CodeIcon
} from '@mui/icons-material';

const SupportSection: React.FC = () => {
    const theme = useTheme();

    const styles = {
        section: {
            py: { xs: 8, md: 12 }
        },
        sectionTitle: {
            fontWeight: 900,
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 2,
            textAlign: 'center'
        },
        sectionSubtitle: {
            fontSize: '1.1rem',
            color: 'text.secondary',
            textAlign: 'center',
            mb: 6,
            maxWidth: 700,
            mx: 'auto'
        },
        featureCard: {
            height: '100%',
            p: 4,
            borderRadius: 3,
            transition: 'all 0.3s ease',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 40px ${theme.palette.primary.main}20`,
                borderColor: 'primary.main'
            }
        }
    };

    return (
        <Box id="support" sx={styles.section}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={styles.sectionTitle}>
                    Get Support
                </Typography>
                <Typography sx={styles.sectionSubtitle}>
                    We're here to help you succeed
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ ...styles.featureCard, textAlign: 'center' }}>
                            <CardContent>
                                <EmailIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Email Support
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Get help via email
                                </Typography>
                                <Link href="mailto:support@devconnect.com" underline="hover">
                                    support@devconnect.com
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ ...styles.featureCard, textAlign: 'center' }}>
                            <CardContent>
                                <PhoneIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Community Forum
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Join discussions
                                </Typography>
                                <Link href="#" underline="hover">
                                    Visit Forum
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ ...styles.featureCard, textAlign: 'center' }}>
                            <CardContent>
                                <CodeIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Documentation
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Guides and tutorials
                                </Typography>
                                <Link href="#" underline="hover">
                                    Read Docs
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default SupportSection;
