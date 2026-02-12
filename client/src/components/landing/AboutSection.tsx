import React from 'react';
import { Box, Container, Typography, Grid, Stack, Divider, useTheme } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';

const AboutSection: React.FC = () => {
    const theme = useTheme();

    const styles = {
        section: {
            py: { xs: 6, md: 12 }
        },
        sectionTitle: {
            fontWeight: 900,
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            mb: 2,
            textAlign: 'center'
        }
    };

    return (
        <Box id="about" sx={styles.section}>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" sx={{ ...styles.sectionTitle, textAlign: 'left' }}>
                            About DevConnect
                        </Typography>
                        <Typography sx={{ fontSize: '1.1rem', color: 'text.secondary', mb: 3 }}>
                            DevConnect is more than just a platform—it's a community where developers come together to learn, share, and grow. We believe in the power of collaboration and continuous improvement.
                        </Typography>
                        <Stack spacing={2}>
                            {[
                                'Built by developers, for developers',
                                'Focus on continuous learning and growth',
                                'Transparent progress tracking',
                                'Supportive global community'
                            ].map((item, index) => (
                                <Stack key={index} direction="row" spacing={2} alignItems="center">
                                    <CheckIcon color="primary" />
                                    <Typography variant="body1">{item}</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                p: 6,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                color: 'white',
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
                                10,000+
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4 }}>
                                Active Developers
                            </Typography>
                            <Divider sx={{ bgcolor: 'white', opacity: 0.3, mb: 4 }} />
                            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
                                50,000+
                            </Typography>
                            <Typography variant="h6">
                                Projects Showcased
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AboutSection;
