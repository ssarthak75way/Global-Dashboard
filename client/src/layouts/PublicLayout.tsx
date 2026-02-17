import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, Theme, alpha } from "@mui/material";
import PublicNavbar from "../components/PublicNavbar";
import LandingFooter from "../components/landing/LandingFooter";

const publicLayoutStyles = {
    root: (theme: Theme) => ({
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: theme.palette.mode === 'light'
                ? `radial-gradient(circle at 50% 0%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
                   radial-gradient(circle at 100% 0%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`
                : `radial-gradient(circle at 50% 0%, ${alpha(theme.palette.primary.dark, 0.2)} 0%, transparent 50%),
                   radial-gradient(circle at 100% 0%, ${alpha(theme.palette.secondary.dark, 0.2)} 0%, transparent 50%)`,
            zIndex: 0,
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'light'
                ? 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                : 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            zIndex: 0,
        }
    }),
    contentWrapper: {
        position: 'relative',
        zIndex: 1,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    }
};

const PublicLayout = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null;

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <Box sx={publicLayoutStyles.root}>
            <PublicNavbar />
            <Box sx={publicLayoutStyles.contentWrapper}>
                <Outlet />
            </Box>
            <LandingFooter />
        </Box>
    );
};

export default PublicLayout;
