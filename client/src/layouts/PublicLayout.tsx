import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, Container, Typography, Theme } from "@mui/material";
import PublicNavbar from "../components/PublicNavbar";

const publicLayoutStyles = {
    root: (theme: Theme) => ({
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.mode === 'light'
            ? '#f8fafc'
            : '#0a0f1d',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: theme.palette.mode === 'light'
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
    }),
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
    container: { flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 8 },
    headerBox: { mb: 6, textAlign: 'center' },
    title: {
        fontWeight: 800,
        letterSpacing: -1,
        color: 'primary.main',
        mb: 1
    },
    subtitle: { fontWeight: 500 },
    footerBox: { mt: 8, textAlign: 'center' }
};

const PublicLayout = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    if (loading) return <div>Loading...</div>;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    // Landing page has its own navbar and footer
    if (isLandingPage) {
        return <Outlet />;
    }

    // Auth pages (login, signup, verify-otp) use the styled layout
    return (
        <>
            <PublicNavbar />
            <Box
                sx={(theme) => publicLayoutStyles.root(theme)}
            >
                <Box sx={publicLayoutStyles.blob} />
                <Container maxWidth="sm" sx={{ ...publicLayoutStyles.container, py: { xs: 4, sm: 8 } }}>
                    <Outlet />

                    <Box sx={publicLayoutStyles.footerBox}>
                        <Typography variant="caption" color="text.secondary">
                            © {new Date().getFullYear()} DevConnect. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default PublicLayout;
