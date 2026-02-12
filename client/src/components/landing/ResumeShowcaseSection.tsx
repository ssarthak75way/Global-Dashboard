import React from 'react';
import { Box, Container, Typography, Grid, Chip, Stack } from '@mui/material';
import { Description as ResumeIcon, Speed as SpeedIcon, AutoFixHigh as AutoIcon } from '@mui/icons-material';

const ResumeShowcaseSection: React.FC = () => {
    const styles = {
        section: {
            py: 10,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                pointerEvents: 'none'
            }
        },
        container: {
            position: 'relative',
            zIndex: 1
        },
        leftContent: {
            pr: { xs: 0, md: 4 },
            color: 'white'
        },
        title: {
            fontWeight: 800,
            mb: 2,
            color: 'white',
            fontSize: { xs: '2rem', md: '2.5rem' }
        },
        subtitle: {
            mb: 4,
            color: 'rgba(255,255,255,0.9)',
            fontSize: { xs: '1rem', md: '1.2rem' },
            lineHeight: 1.7
        },
        featureBox: {
            mb: 3,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2
        },
        iconWrapper: {
            bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 54,
            minHeight: 54
        },
        featureContent: {
            flex: 1
        },
        featureTitle: {
            fontWeight: 600,
            mb: 0.5,
            fontSize: '1.15rem',
            color: 'white'
        },
        featureDesc: {
            color: 'rgba(255,255,255,0.85)',
            fontSize: '1rem',
            lineHeight: 1.6
        },
        statsBox: {
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
            mb: 5,
            mt: 2
        },
        statItem: {
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5
        },
        statNumber: {
            fontWeight: 800,
            fontSize: '2.5rem',
            color: 'white',
            lineHeight: 1
        },
        statLabel: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        rightContent: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            minHeight: { xs: '400px', md: '600px' }
        },
        resumeWrapper: {
            position: 'relative',
            width: '100%',
            maxWidth: '450px',
            transform: 'perspective(1000px) rotateY(-5deg)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'perspective(1000px) rotateY(0deg)'
            }
        },
        resumeLayer1: {
            position: 'absolute',
            top: 20,
            left: -20,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            border: '2px solid rgba(255, 255, 255, 0.2)',
            zIndex: 1
        },
        resumeLayer2: {
            position: 'absolute',
            top: 10,
            left: -10,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            border: '2px solid rgba(255, 255, 255, 0.15)',
            zIndex: 2
        },
        resumeMain: {
            height: { xs: 'auto', md: '85vh' },
            position: 'relative',
            zIndex: 3,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            overflow: 'auto',
            border: '1px solid rgba(255,255,255,0.1)',
            '&::-webkit-scrollbar': {
                width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
                bgcolor: 'rgba(0,0,0,0.1)',
                borderRadius: '10px'
            }
        },
        resumeHeader: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
            textAlign: 'center'
        },
        resumeName: {
            fontWeight: 800,
            fontSize: '1.8rem',
            mb: 0.5,
            letterSpacing: '1px'
        },
        resumeTitle: {
            fontSize: '1rem',
            opacity: 0.9,
            mb: 1.5,
            fontWeight: 500
        },
        resumeContact: {
            fontSize: '0.8rem',
            opacity: 0.85,
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap'
        },
        resumeBody: {
            p: 4
        },
        resumeSection: {
            mb: 3
        },
        resumeSectionTitle: {
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#667eea',
            mb: 1.5,
            pb: 0.8,
            borderBottom: '2px solid #667eea',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        resumeItem: {
            mb: 2
        },
        resumeItemTitle: {
            fontWeight: 700,
            fontSize: '1rem',
            mb: 0.4,
            color: '#2d3748'
        },
        resumeItemSubtitle: {
            fontSize: '0.85rem',
            color: 'text.secondary',
            mb: 1,
            fontWeight: 500
        },
        resumeItemDesc: {
            fontSize: '0.85rem',
            color: '#4a5568',
            lineHeight: 1.6
        },
        skillChips: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1
        },
        skillChip: {
            height: 28,
            fontSize: '0.8rem',
            bgcolor: 'rgba(102, 126, 234, 0.1)',
            color: '#667eea',
            fontWeight: 700,
            borderRadius: 1.5,
            '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.2)'
            }
        }
    };

    return (
        <Box sx={styles.section}>
            <Container maxWidth="lg" sx={styles.container}>
                <Grid container spacing={8} alignItems="center">
                    {/* Left: Information */}
                    <Grid item xs={12} md={6}>
                        <Box sx={styles.leftContent}>
                            <Typography variant="h2" sx={styles.title}>
                                ATS-Optimized Resume Builder
                            </Typography>
                            <Typography sx={styles.subtitle}>
                                Build a professional resume that gets you hired. Our intelligent system ensures your data is perfectly structured for both humans and machines.
                            </Typography>

                            {/* Stats */}
                            <Box sx={styles.statsBox}>
                                <Box sx={styles.statItem}>
                                    <Typography sx={styles.statNumber}>98%</Typography>
                                    <Typography sx={styles.statLabel}>ATS Score</Typography>
                                </Box>
                                <Box sx={styles.statItem}>
                                    <Typography sx={styles.statNumber}>10+</Typography>
                                    <Typography sx={styles.statLabel}>Templates</Typography>
                                </Box>
                                <Box sx={styles.statItem}>
                                    <Typography sx={styles.statNumber}>5min</Typography>
                                    <Typography sx={styles.statLabel}>Setup Time</Typography>
                                </Box>
                            </Box>

                            {/* Features Section */}
                            <Box sx={styles.featureBox}>
                                <Box sx={styles.iconWrapper}>
                                    <ResumeIcon sx={{ fontSize: 30, color: 'white' }} />
                                </Box>
                                <Box sx={styles.featureContent}>
                                    <Typography sx={styles.featureTitle}>
                                        Intelligent Formatting
                                    </Typography>
                                    <Typography sx={styles.featureDesc}>
                                        Automatically organize your experience into professional layouts that adhere to industry standards and ATS requirements.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={styles.featureBox}>
                                <Box sx={styles.iconWrapper}>
                                    <SpeedIcon sx={{ fontSize: 30, color: 'white' }} />
                                </Box>
                                <Box sx={styles.featureContent}>
                                    <Typography sx={styles.featureTitle}>
                                        One-Click Export
                                    </Typography>
                                    <Typography sx={styles.featureDesc}>
                                        Download your polished resume in PDF format instantly, or print it directly with perfect A4 scaling.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={styles.featureBox}>
                                <Box sx={styles.iconWrapper}>
                                    <AutoIcon sx={{ fontSize: 30, color: 'white' }} />
                                </Box>
                                <Box sx={styles.featureContent}>
                                    <Typography sx={styles.featureTitle}>
                                        Auto-Sync Profile
                                    </Typography>
                                    <Typography sx={styles.featureDesc}>
                                        Keep your resume updated by syncing directly with your DevConnect professional profile data.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right: Resume Sample with Layers */}
                    <Grid item xs={12} md={6}>
                        <Box sx={styles.rightContent}>
                            <Box sx={styles.resumeWrapper}>
                                <Box sx={styles.resumeLayer1} />
                                <Box sx={styles.resumeLayer2} />

                                <Box sx={styles.resumeMain}>
                                    <Box sx={styles.resumeHeader}>
                                        <Typography sx={styles.resumeName}>ALEX RIVERA</Typography>
                                        <Typography sx={styles.resumeTitle}>Senior Software Architect</Typography>
                                        <Box sx={styles.resumeContact}>
                                            <span>alex.rivera@dev.com</span>
                                            <span>•</span>
                                            <span>+1 (555) 000-0000</span>
                                            <span>•</span>
                                            <span>Github: alex-rivera</span>
                                        </Box>
                                    </Box>

                                    <Box sx={styles.resumeBody}>
                                        <Box sx={styles.resumeSection}>
                                            <Typography sx={styles.resumeSectionTitle}>Profile Summary</Typography>
                                            <Typography sx={styles.resumeItemDesc}>
                                                Expert architect with 10+ years of experience in designing high-scale distributed systems. Specialist in cloud native applications and developer productivity.
                                            </Typography>
                                        </Box>

                                        <Box sx={styles.resumeSection}>
                                            <Typography sx={styles.resumeSectionTitle}>Experience</Typography>
                                            <Box sx={styles.resumeItem}>
                                                <Typography sx={styles.resumeItemTitle}>Director of Engineering | TechGiant</Typography>
                                                <Typography sx={styles.resumeItemSubtitle}>2020 - Present</Typography>
                                                <Typography sx={styles.resumeItemDesc}>
                                                    • Led a global team of 50+ engineers to deliver core platform services.<br />
                                                    • Successfully migrated legacy infrastructure to a modern mesh architecture.
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={styles.resumeSection}>
                                            <Typography sx={styles.resumeSectionTitle}>Core Skills</Typography>
                                            <Stack sx={styles.skillChips}>
                                                {['Go', 'Rust', 'Kubernetes', 'Terraform', 'GraphQL', 'PostgreSQL'].map(skill => (
                                                    <Chip key={skill} label={skill} sx={styles.skillChip} size="small" />
                                                ))}
                                            </Stack>
                                        </Box>

                                        <Box sx={styles.resumeSection}>
                                            <Typography sx={styles.resumeSectionTitle}>Education</Typography>
                                            <Box sx={styles.resumeItem}>
                                                <Typography sx={styles.resumeItemTitle}>M.S. Logic & Computation</Typography>
                                                <Typography sx={styles.resumeItemSubtitle}>Carnegie Mellon University</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ResumeShowcaseSection;
