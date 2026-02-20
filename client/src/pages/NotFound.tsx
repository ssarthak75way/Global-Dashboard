import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    Fade,
    Grow,
    Theme
} from "@mui/material";
import {
    Home as HomeIcon,
    ArrowBack as BackIcon,
    SearchOff as NotFoundIcon
} from "@mui/icons-material";
import LandingFooter from "../components/landing/LandingFooter";
import PublicNavbar from "../components/PublicNavbar";

const NotFound = () => {
    const navigate = useNavigate();

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: (theme: Theme) => theme.palette.mode === 'light'
                ? '#f8fafc'
                : '#0a0f1d',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: (theme: Theme) => theme.palette.mode === 'light'
                    ? 'radial-gradient(#e2e8f0 1px, transparent 1px)'
                    : 'radial-gradient(#1e293b 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.5,
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                top: '-10%',
                left: '10%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: 0,
                pointerEvents: 'none',
            }
        },
        blob: {
            position: 'absolute',
            bottom: '-10%',
            right: '10%',
            width: '40%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
            filter: 'blur(100px)',
            zIndex: 0,
            pointerEvents: 'none',
        },
        paper: {
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: (theme: Theme) => theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.85)'
                : 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(24px)',
            boxShadow: (theme: Theme) => theme.palette.mode === 'light'
                ? '0 20px 60px -15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                : '0 20px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '600px',
            width: '100%',
            mx: 2,
            textAlign: 'center',
            zIndex: 1,
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: (theme: Theme) => `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
                backgroundSize: '200% 100%',
                animation: 'gradientShift 3s ease infinite',
            },
            '@keyframes gradientShift': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' }
            }
        },
        iconBox: {
            mb: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        icon: {
            fontSize: { xs: 80, sm: 100, md: 120 },
            color: 'error.main',
            opacity: 0.9,
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-20px)' }
            }
        },
        errorCode: {
            fontWeight: 900,
            mb: 2,
            letterSpacing: -2,
            background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 50%, ${theme.palette.warning.main} 100%)`,
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientAnimation 4s ease infinite',
            '@keyframes gradientAnimation': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' }
            }
        },
        title: {
            fontWeight: 800,
            mb: 2,
            color: 'text.primary'
        },
        description: {
            mb: 4,
            color: 'text.secondary',
            fontWeight: 500,
            lineHeight: 1.6
        },
        buttonStack: {
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center'
        },
        primaryButton: {
            py: 1.5,
            px: 4,
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 800,
            textTransform: 'none',
            background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: '0 4px 12px -2px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: '0 12px 24px -4px rgba(99, 102, 241, 0.5)',
                background: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            },
            '&:active': {
                transform: 'translateY(-1px) scale(0.98)'
            }
        },
        secondaryButton: {
            py: 1.5,
            px: 4,
            borderRadius: 2,
            borderColor: 'divider',
            borderWidth: '2px',
            color: 'text.primary',
            fontWeight: 700,
            textTransform: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main',
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1)'
            }
        }
    };

    return (
        <>
            <PublicNavbar />
            <Box sx={styles.container}>
                <Box sx={styles.blob} />

                <Fade in timeout={600}>
                    <Paper elevation={0} sx={styles.paper}>
                        <Grow in timeout={800}>
                            <Box sx={styles.iconBox}>
                                <NotFoundIcon sx={styles.icon} />
                            </Box>
                        </Grow>

                        <Grow in timeout={900}>
                            <Typography
                                variant="h1"
                                sx={{
                                    ...styles.errorCode,
                                    fontSize: { xs: '4rem', sm: '6rem', md: '8rem' }
                                }}
                            >
                                404
                            </Typography>
                        </Grow>

                        <Grow in timeout={1000}>
                            <Typography
                                variant="h4"
                                sx={{
                                    ...styles.title,
                                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                                }}
                            >
                                Page Not Found
                            </Typography>
                        </Grow>

                        <Grow in timeout={1100}>
                            <Typography variant="body1" sx={styles.description}>
                                Oops! The page you're looking for seems to have wandered off.
                                <br />
                                Don't worry, let's get you back on track.
                            </Typography>
                        </Grow>

                        <Grow in timeout={1200}>
                            <Stack sx={styles.buttonStack}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<HomeIcon />}
                                    onClick={() => navigate('/')}
                                    sx={styles.primaryButton}
                                >
                                    Go Home
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<BackIcon />}
                                    onClick={() => navigate(-1)}
                                    sx={styles.secondaryButton}
                                >
                                    Go Back
                                </Button>
                            </Stack>
                        </Grow>
                    </Paper>
                </Fade>
            </Box>
            <LandingFooter /></>
    );
};

export default NotFound;
