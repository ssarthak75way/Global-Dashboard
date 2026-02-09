import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, Container, Typography } from "@mui/material";

const PublicLayout = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                background: (theme) => theme.palette.mode === 'light'
                    ? '#f8fafc'
                    : '#0a0f1d',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: (theme) => theme.palette.mode === 'light'
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
            }}
        >
            <Box sx={{
                position: 'absolute',
                bottom: '-10%',
                right: '10%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: 0,
                pointerEvents: 'none',
            }} />
            <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 8 }}>
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: -1,
                            color: 'primary.main',
                            mb: 1
                        }}
                    >
                        Global Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        The Industry Standard Engineering Management Tool
                    </Typography>
                </Box>

                <Outlet />

                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        © {new Date().getFullYear()} Global Dashboard Inc. All rights reserved. Professional Edition.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default PublicLayout;
