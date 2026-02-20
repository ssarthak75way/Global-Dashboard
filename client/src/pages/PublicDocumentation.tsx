import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Stack,
    Grid,
    useTheme,
    useMediaQuery,
    Fade,
    Button,
    Divider,
    Avatar,
    Slide,
    Zoom,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    LinearProgress,
    Chip,
    Menu,
    MenuItem
} from '@mui/material';
import {
    RocketLaunch as RocketIcon,
    Person as PersonIcon,
    CheckCircle as CheckCircleIcon,
    ArrowForward as ArrowForwardIcon,
    AutoGraph as AutoGraphIcon,
    Stars as StarsIcon,
    ConnectWithoutContact as ConnectIcon,
    KeyboardArrowDown as ChevronIcon
} from '@mui/icons-material';
import PublicNavbar from '../components/PublicNavbar';
import LandingFooter from '../components/landing/LandingFooter';
import { useNavigate } from 'react-router-dom';
import { docVersions } from '../utils/data';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

const useInView = (options = {}) => {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [options]);

    return [ref, isInView];
};

const ScrollReveal: React.FC<{ children: React.ReactElement, delay?: number }> = ({ children, delay = 0 }) => {
    const [ref, inView] = useInView({ threshold: 0.1 });
    return (
        <div ref={ref as any}>
            <Fade in={inView as boolean} timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
                {children}
            </Fade>
        </div>
    );
};

const PublicDocumentation: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);
    const [activeVersion, setActiveVersion] = useState(docVersions[0]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleVersionClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleVersionClose = (version?: typeof docVersions[0]) => {
        setAnchorEl(null);
        if (version) {
            setActiveVersion(version);
        }
    };

    const colors = {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        bg: theme.palette.mode === 'light' ? '#f8fafc' : '#020617',
        glass: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.7)'
    };

    // Custom animations
    const floatKeyframes = `
        @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -50px) rotate(5deg); }
            66% { transform: translate(-20px, 20px) rotate(-5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes floatReverse {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-40px, 40px) rotate(-10deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        @keyframes borderFlow {
            0% { border-image-source: linear-gradient(0deg, ${colors.primary}, ${colors.secondary}); }
            50% { border-image-source: linear-gradient(180deg, ${colors.secondary}, ${colors.accent}); }
            100% { border-image-source: linear-gradient(360deg, ${colors.primary}, ${colors.secondary}); }
        }
    `;

    const styles = {
        root: {
            minHeight: '100vh',
            bgcolor: colors.bg,
            position: 'relative',
            overflow: 'hidden',
        },
        backgroundBlob: {
            position: 'fixed',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            filter: 'blur(120px)',
            opacity: 0.15,
            zIndex: 0,
            pointerEvents: 'none',
        },
        container: {
            position: 'relative',
            zIndex: 1,
            pt: { xs: 4, md: 8 },
            pb: 8,
        },
        sidebar: {
            position: 'sticky',
            top: 100,
            height: 'fit-content',
            display: { xs: 'none', md: 'block' },
        },
        navPaper: {
            p: 1.5,
            borderRadius: 4,
            bgcolor: colors.glass,
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
        },
        mainContent: {
            pl: { md: 4 },
        },
        header: {
            mb: 6,
            textAlign: 'left',
        },
        title: {
            fontWeight: 900,
            fontSize: { xs: '2.5rem', md: '3.75rem' },
            letterSpacing: '-0.02em',
            background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 25%, #fff 50%, ${colors.secondary} 75%, ${colors.primary} 100%)`,
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 4s linear infinite',
            mb: 1,
        },
        subtitle: {
            fontSize: '1.25rem',
            color: 'text.secondary',
            fontWeight: 500,
            maxWidth: '600px',
        },
        tab: {
            justifyContent: 'flex-start',
            textAlign: 'left',
            minHeight: 52,
            px: 2,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            mb: 0.5,
            transition: 'all 0.2s',
            '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
            },
            '&:hover:not(.Mui-selected)': {
                bgcolor: 'action.hover',
                transform: 'translateX(4px)',
            }
        },
        contentPanel: {
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            bgcolor: colors.glass,
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
        },
        sectionTitle: {
            fontWeight: 800,
            fontSize: '1.75rem',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: 'text.primary',
        },
        card: {
            height: '100%',
            p: 3,
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'light' ? 'white' : 'rgba(30, 41, 59, 0.5)',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-6px) scale(1.02)',
                boxShadow: theme.shadows[15],
                borderColor: colors.primary,
            }
        },
        stepIcon: {
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'white',
            mb: 2,
            boxShadow: `0 8px 16px ${theme.palette.primary.main}40`,
            transition: 'transform 0.3s ease',
        },
        bentoGrid: {
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gridAutoRows: 'minmax(180px, auto)',
            gap: 2,
        },
        bentoItem: (span: number = 1, color: string = 'primary.main') => ({
            gridColumn: { md: `span ${span}` },
            p: 4,
            borderRadius: 4,
            bgcolor: theme.palette.mode === 'light' ? 'white' : 'rgba(30, 41, 59, 0.4)',
            border: '2px solid transparent',
            borderImageSlice: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 20px 40px rgba(0,0,0,0.1)`,
                borderImageSource: `linear-gradient(45deg, ${color}, ${colors.secondary})`,
                animation: 'borderFlow 3s linear infinite',
                '& .bento-icon': { transform: 'scale(1.2) rotate(10deg)', color: color }
            }
        })
    };

    const renderTabs = () => (
        <Tabs
            orientation={isMobile ? "horizontal" : "vertical"}
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            TabIndicatorProps={{ sx: { display: 'none' } }}
            sx={{
                '& .MuiTabs-flexContainer': { gap: 0.5 },
                border: 'none',
            }}
        >
            <Tab icon={<RocketIcon sx={{ fontSize: 20 }} />} label="Getting Started" iconPosition="start" sx={styles.tab} />
            <Tab icon={<PersonIcon sx={{ fontSize: 20 }} />} label="Your Professional ID" iconPosition="start" sx={styles.tab} />
            <Tab icon={<AutoGraphIcon sx={{ fontSize: 20 }} />} label="Growth & Metrics" iconPosition="start" sx={styles.tab} />
            <Tab icon={<ConnectIcon sx={{ fontSize: 20 }} />} label="Connecting" iconPosition="start" sx={styles.tab} />
            <Tab icon={<StarsIcon sx={{ fontSize: 20 }} />} label="Core Benefits" iconPosition="start" sx={styles.tab} />
        </Tabs>
    );

    return (
        <Box sx={styles.root}>
            <style>{floatKeyframes}</style>
            <PublicNavbar />
            {/* Background Decorations with Animations */}
            <Box sx={{
                ...styles.backgroundBlob,
                top: '-10%',
                left: '-10%',
                bgcolor: colors.primary,
                animation: 'float 20s infinite ease-in-out'
            }} />
            <Box sx={{
                ...styles.backgroundBlob,
                bottom: '-10%',
                right: '-10%',
                bgcolor: colors.secondary,
                animation: 'floatReverse 25s infinite ease-in-out'
            }} />
            <Box sx={{
                ...styles.backgroundBlob,
                top: '40%',
                right: '15%',
                width: '300px',
                height: '300px',
                bgcolor: colors.accent,
                opacity: 0.1,
                animation: 'float 15s infinite ease-in-out alternate'
            }} />

            <Container maxWidth="lg" sx={styles.container}>
                <Grid container spacing={0}>
                    <Grid item xs={12} md={3}>
                        <Box sx={styles.sidebar}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 2 }}>
                                <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                    User Guide
                                </Typography>
                                <Chip
                                    label={activeVersion.version}
                                    size="small"
                                    onClick={handleVersionClick}
                                    sx={{
                                        fontWeight: 800,
                                        height: 24,
                                        fontSize: '0.65rem',
                                        bgcolor: `${colors.primary}15`,
                                        color: colors.primary,
                                        borderRadius: 1.5,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        border: '1px solid transparent',
                                        '&:hover': {
                                            bgcolor: `${colors.primary}25`,
                                            borderColor: `${colors.primary}40`,
                                            transform: 'translateY(-1px)'
                                        },
                                        '& .MuiChip-label': { px: 1, display: 'flex', alignItems: 'center', gap: 0.5 }
                                    }}
                                    icon={<ChevronIcon sx={{ fontSize: '1rem !important', color: `${colors.primary} !important` }} />}
                                />
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => handleVersionClose()}
                                    PaperProps={{
                                        sx: {
                                            mt: 1,
                                            borderRadius: 3,
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            minWidth: 160,
                                            bgcolor: colors.glass,
                                            backdropFilter: 'blur(20px)',
                                        }
                                    }}
                                >
                                    {docVersions.map((v) => (
                                        <MenuItem
                                            key={v.version}
                                            onClick={() => handleVersionClose(v)}
                                            selected={v.version === activeVersion.version}
                                            sx={{
                                                fontSize: '0.85rem',
                                                fontWeight: 700,
                                                borderRadius: 1.5,
                                                mx: 1,
                                                my: 0.5,
                                                '&:hover': { bgcolor: `${colors.primary}10` },
                                                '&.Mui-selected': { bgcolor: `${colors.primary}20`, color: colors.primary }
                                            }}
                                        >
                                            <Stack direction="row" justifyContent="space-between" width="100%" alignItems="center">
                                                <Typography variant="inherit">{v.label}</Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '0.65rem' }}>{v.date}</Typography>
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                            <Paper sx={styles.navPaper}>
                                {renderTabs()}
                            </Paper>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={9}>
                        <Box sx={styles.mainContent}>
                            <Box sx={styles.header}>
                                <ScrollReveal>
                                    <Box>
                                        <Typography variant="h1" sx={styles.title}>
                                            Welcome to D. Connect
                                        </Typography>
                                        <Typography sx={styles.subtitle}>
                                            Your all-in-one platform to showcase your developer journey, connect with peers, and build a professional presence.
                                        </Typography>
                                    </Box>
                                </ScrollReveal>
                            </Box>

                            {isMobile && (
                                <Box sx={{ mb: 4 }}>
                                    <Paper sx={{ ...styles.navPaper, borderRadius: 3 }}>
                                        {renderTabs()}
                                    </Paper>
                                </Box>
                            )}

                            <Fade in key={tabValue} timeout={400}>
                                <Paper sx={styles.contentPanel}>
                                    {/* Getting Started */}
                                    <TabPanel value={tabValue} index={0}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <RocketIcon color="primary" sx={{ fontSize: 32 }} /> Getting Started
                                        </Typography>

                                        <Stepper orientation="vertical" nonLinear activeStep={-1} sx={{
                                            '& .MuiStepConnector-line': { minHeight: 40, borderLeftWidth: 2, borderColor: 'divider' },
                                            '& .MuiStepContent-root': { borderLeftWidth: 2, borderColor: 'divider' }
                                        }}>
                                            {[
                                                { title: 'Quick Sign Up', desc: 'Create your account in seconds with just your name and email.', icon: <PersonIcon /> },
                                                { title: 'Verify Identity', desc: 'Check your email for a secure OTP to verify your account.', icon: <CheckCircleIcon /> },
                                                { title: 'Profile Setup', desc: 'Add your basic details to start building your professional identity.', icon: <ArrowForwardIcon /> }
                                            ].map((step, idx) => (
                                                <Step key={idx} active>
                                                    <StepLabel icon={
                                                        <Box sx={{ ...styles.stepIcon, mb: 0, width: 32, height: 32, fontSize: '0.8rem' }}>{idx + 1}</Box>
                                                    }>
                                                        <Typography variant="h6" fontWeight={800}>{step.title}</Typography>
                                                    </StepLabel>
                                                    <StepContent>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 400 }}>{step.desc}</Typography>
                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>

                                        <ScrollReveal delay={400}>
                                            <Box sx={{ mt: 6, p: 4, borderRadius: 4, bgcolor: `${colors.primary}10`, border: `1px solid ${colors.primary}20`, position: 'relative', overflow: 'hidden', transition: '0.3s', '&:hover': { background: `${colors.primary}15`, transform: 'scale(1.01)' } }}>
                                                <Box sx={{ position: 'absolute', top: 0, left: 0, height: 4, bgcolor: colors.primary, width: '33%', borderRadius: '0 2px 2px 0' }} />
                                                <Typography variant="h6" fontWeight={800} gutterBottom>Ready to join?</Typography>
                                                <Typography variant="body1" sx={{ mb: 3 }}>Thousands of developers are already building their IDs on D. Connect.</Typography>
                                                <Button variant="contained"
                                                    onClick={() => navigate('/signup')}
                                                    endIcon={<ArrowForwardIcon />} sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 700, textTransform: 'none', boxShadow: `0 8px 24px ${colors.primary}40` }}>
                                                    Create Your Account
                                                </Button>
                                            </Box>
                                        </ScrollReveal>
                                    </TabPanel>

                                    {/* Your Professional ID */}
                                    <TabPanel value={tabValue} index={1}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <PersonIcon color="primary" sx={{ fontSize: 32 }} /> Your Professional ID
                                        </Typography>

                                        <Grid container spacing={4} alignItems="center">
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7 }}>
                                                    In D. Connect, your profile is more than just a page—it's your digital identity in the tech world. Showcase your true potential with data-driven insights.
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <Zoom in timeout={600}>
                                                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', borderLeft: `4px solid ${colors.primary}` }}>
                                                            <Typography variant="subtitle2" fontWeight={800}>Dynamic Skills Grid</Typography>
                                                            <Typography variant="body2" color="text.secondary">Automatically categorized technical toolkit.</Typography>
                                                        </Box>
                                                    </Zoom>
                                                    <Zoom in timeout={800}>
                                                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', borderLeft: `4px solid ${colors.secondary}` }}>
                                                            <Typography variant="subtitle2" fontWeight={800}>Verified Milestones</Typography>
                                                            <Typography variant="body2" color="text.secondary">Display certifications and achievements with pride.</Typography>
                                                        </Box>
                                                    </Zoom>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <ScrollReveal delay={300}>
                                                    <Box sx={{
                                                        p: 3,
                                                        borderRadius: 4,
                                                        bgcolor: theme.palette.mode === 'light' ? 'white' : 'rgba(15, 23, 42, 0.8)',
                                                        border: '1px solid',
                                                        borderColor: 'primary.main',
                                                        boxShadow: `0 20px 40px ${colors.primary}20`,
                                                        transform: 'rotate(2deg)',
                                                        position: 'relative'
                                                    }}>
                                                        <Box sx={{ position: 'absolute', top: -10, right: -10, width: 40, height: 40, bgcolor: colors.accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: 3 }}>
                                                            <StarsIcon fontSize="small" />
                                                        </Box>
                                                        <Stack spacing={2}>
                                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                                <Avatar sx={{ width: 48, height: 48, bgcolor: colors.primary }}>JD</Avatar>
                                                                <Box>
                                                                    <Typography variant="subtitle2" fontWeight={900}>John Developer</Typography>
                                                                    <Typography variant="caption" color="text.secondary">Full Stack Engineer</Typography>
                                                                </Box>
                                                            </Box>
                                                            <Divider sx={{ opacity: 0.5 }} />
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                                {['React', 'TypeScript', 'Node.js', 'PostgreSQL'].map(s => (
                                                                    <Box key={s} sx={{ px: 1, py: 0.5, bgcolor: 'primary.main', color: 'white', borderRadius: 1, fontSize: '0.65rem', fontWeight: 700 }}>{s}</Box>
                                                                ))}
                                                            </Box>
                                                            <LinearProgress variant="determinate" value={85} sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover' }} />
                                                            <Typography variant="caption" color="text.secondary" textAlign="right" display="block">Profile Strength: 85%</Typography>
                                                        </Stack>
                                                    </Box>
                                                </ScrollReveal>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>

                                    {/* Growth & Metrics */}
                                    <TabPanel value={tabValue} index={2}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <AutoGraphIcon color="primary" sx={{ fontSize: 32 }} /> Growth & Metrics
                                        </Typography>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12} md={6}>
                                                <Zoom in timeout={600}>
                                                    <Box sx={styles.card}>
                                                        <Typography variant="h6" fontWeight={800} gutterBottom>Activity Heatmap</Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            Track your contributions and streaks with our GitHub-style activity map. Build consistency and show off your momentum.
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            {[1, 0.6, 0.8, 0.3, 0.9, 0.5, 0.7].map((o, i) => (
                                                                <Box key={i} sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: colors.primary, opacity: o }} />
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                </Zoom>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Zoom in timeout={800}>
                                                    <Box sx={styles.card}>
                                                        <Typography variant="h6" fontWeight={800} gutterBottom>Skill Endorsements</Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            Get recognized for your expertise through community validation and professional milestones.
                                                        </Typography>
                                                        <Stack direction="row" spacing={1}>
                                                            <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'action.hover', borderRadius: 1.5, fontSize: '0.75rem', fontWeight: 700 }}>React</Box>
                                                            <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'action.hover', borderRadius: 1.5, fontSize: '0.75rem', fontWeight: 700 }}>Node.js</Box>
                                                        </Stack>
                                                    </Box>
                                                </Zoom>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>

                                    {/* Connecting */}
                                    <TabPanel value={tabValue} index={3}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <ConnectIcon color="primary" sx={{ fontSize: 32 }} /> Connecting with Peers
                                        </Typography>
                                        <ScrollReveal>
                                            <Stack spacing={3}>
                                                <Slide direction="up" in timeout={600}>
                                                    <Box sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', gap: 3, alignItems: 'center', bgcolor: 'background.paper', transition: '0.3s', '&:hover': { transform: 'scale(1.01)', borderColor: colors.primary } }}>
                                                        <Avatar sx={{ width: 64, height: 64, bgcolor: colors.accent, boxShadow: `0 0 20px ${colors.accent}40` }}>B</Avatar>
                                                        <Box>
                                                            <Typography variant="h6" fontWeight={800}>Interactive Board</Typography>
                                                            <Typography variant="body2" color="text.secondary">Ask questions, share updates, and participate in technical discussions with a global developer audience.</Typography>
                                                        </Box>
                                                    </Box>
                                                </Slide>
                                                <Slide direction="up" in timeout={800}>
                                                    <Box sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', gap: 3, alignItems: 'center', bgcolor: 'background.paper', transition: '0.3s', '&:hover': { transform: 'scale(1.01)', borderColor: colors.secondary } }}>
                                                        <Avatar sx={{ width: 64, height: 64, bgcolor: colors.secondary, boxShadow: `0 0 20px ${colors.secondary}40` }}>F</Avatar>
                                                        <Box>
                                                            <Typography variant="h6" fontWeight={800}>Real-time Feed</Typography>
                                                            <Typography variant="body2" color="text.secondary">Stay updated with what your network is building and share your latest wins instantly.</Typography>
                                                        </Box>
                                                    </Box>
                                                </Slide>
                                            </Stack>
                                        </ScrollReveal>
                                    </TabPanel>

                                    {/* Core Benefits */}
                                    <TabPanel value={tabValue} index={4}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <StarsIcon color="primary" sx={{ fontSize: 32 }} /> Why D. Connect?
                                        </Typography>

                                        <ScrollReveal delay={200}>
                                            <Box sx={styles.bentoGrid}>
                                                <Box sx={styles.bentoItem(2, colors.primary)}>
                                                    <Stack direction="row" spacing={3} alignItems="center">
                                                        <StarsIcon className="bento-icon" sx={{ fontSize: 40, transition: '0.3s' }} />
                                                        <Box>
                                                            <Typography variant="h5" fontWeight={900} gutterBottom>Zero Friction Networking</Typography>
                                                            <Typography variant="body1" color="text.secondary">
                                                                Stop managing multiple profile sites. One link, everything showcased. From skills to streaks, we've got you covered.
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Box>

                                                <Box sx={styles.bentoItem(1, colors.accent)}>
                                                    <Typography variant="h6" fontWeight={800} gutterBottom>Developer First</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Built by developers for developers. The tools you actually need for your career.
                                                    </Typography>
                                                </Box>

                                                <Box sx={styles.bentoItem(1, colors.secondary)}>
                                                    <Typography variant="h6" fontWeight={800} gutterBottom>Global Presence</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Connect with peers from around the world and showcase your journey.
                                                    </Typography>
                                                </Box>

                                                <Box sx={styles.bentoItem(2, colors.primary)}>
                                                    <Stack direction="row" spacing={3} alignItems="center">
                                                        <AutoGraphIcon className="bento-icon" sx={{ fontSize: 40, transition: '0.3s' }} />
                                                        <Box>
                                                            <Typography variant="h6" fontWeight={800} gutterBottom>Professional Edge</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Stand out to recruiters with data-driven profiles and premium resumes that get noticed.
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        </ScrollReveal>
                                    </TabPanel>
                                </Paper>
                            </Fade>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <LandingFooter />
        </Box>
    );
};

export default PublicDocumentation;
