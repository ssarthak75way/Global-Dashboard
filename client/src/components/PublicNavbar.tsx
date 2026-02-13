import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useTheme as useMuiTheme,
    useMediaQuery,
    Container,
    Avatar,
    Tooltip
} from '@mui/material';

import {
    MenuBook as DocumentationIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon
} from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserMenu from './UserMenu';

const PublicNavbar: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const { theme: themeMode, toggleTheme } = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useMuiTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const scrollToSection = (href: string) => {
        // If not on landing page, navigate there first
        if (location.pathname !== '/') {
            navigate('/' + href);
            setMobileOpen(false);
            return;
        }

        // If on landing page, smooth scroll to section
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setMobileOpen(false);
    };

    const styles = {
        appBar: {
            bgcolor: 'background.paper',
            boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid',
            borderColor: 'divider'
        },
        toolbar: {
            minHeight: { xs: 64, md: 80 },
            px: { xs: 2, md: 4 }
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer'
        },
        logoImage: {
            width: 40,
            height: 40,
            borderRadius: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            color: 'white',
            fontSize: '1.2rem'
        },
        logoText: {
            fontWeight: 900,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: -0.5
        },
        navButton: {
            mx: 0.25,
            px: { md: 1.5, lg: 2 },
            fontWeight: 600,
            color: 'text.primary',
            textTransform: 'none',
            fontSize: '0.9rem',
            '&:hover': {
                bgcolor: 'action.hover',
                color: 'primary.main'
            }
        },
        ctaButton: {
            ml: { xs: 1, md: 2 },
            px: { xs: 2, md: 3 },
            py: 1,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            fontSize: { xs: '0.85rem', md: '0.95rem' },
            boxShadow: `0 4px 14px ${theme.palette.primary.main}40`
        },
        drawer: {
            '& .MuiDrawer-paper': {
                width: { xs: '100%', sm: 280 },
                bgcolor: 'background.default'
            }
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
        }
    };

    const drawer = (
        <Box>
            <Box sx={styles.drawerHeader}>
                <Typography variant="h6" sx={styles.logoText}>
                    DevConnect
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { toggleTheme(); setMobileOpen(false); }}>
                        <ListItemText
                            primary={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
                            primaryTypographyProps={{ fontWeight: 600 }}
                        />
                        <IconButton size="small" sx={{ ml: 1 }}>
                            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                        </IconButton>
                    </ListItemButton>
                </ListItem>

                {isAuthenticated ? (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}>
                            <ListItemText
                                primary="Go to Dashboard"
                                primaryTypographyProps={{ fontWeight: 600, color: 'primary.main' }}
                            />
                        </ListItemButton>
                    </ListItem>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => { navigate('/guide'); setMobileOpen(false); }}>
                                <ListItemText
                                    primary="Guide"
                                    primaryTypographyProps={{ fontWeight: 600 }}
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                                <ListItemText
                                    primary="Login"
                                    primaryTypographyProps={{ fontWeight: 600, color: 'primary.main' }}
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem sx={{ px: 2, pt: 1 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => { navigate('/signup'); setMobileOpen(false); }}
                                sx={{ ...styles.ctaButton, ml: 0 }}
                            >
                                Get Started
                            </Button>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" sx={styles.appBar}>
                <Container maxWidth="xl">
                    <Toolbar sx={styles.toolbar} disableGutters>
                        <Box sx={styles.logo} onClick={() => scrollToSection('#home')}>
                            <Box sx={styles.logoImage}>D</Box>
                            <Typography variant="h6" sx={styles.logoText}>
                                DevConnect
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        <Tooltip title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}>
                            <IconButton
                                onClick={toggleTheme}
                                color="inherit"
                                sx={{
                                    bgcolor: 'action.hover',
                                    '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                    mr: 1
                                }}
                            >
                                {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Tooltip>

                        {isMobile ? (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={handleDrawerToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                {isAuthenticated ? (
                                    <>
                                        <Button
                                            startIcon={<DocumentationIcon />}
                                            onClick={() => navigate('/documentation')}
                                            sx={{ ...styles.navButton, ml: 2 }}
                                        >
                                            Docs
                                        </Button>
                                        <Button
                                            startIcon={<DashboardIcon />}
                                            onClick={() => navigate('/dashboard')}
                                            sx={{ ...styles.navButton, ml: 2 }}
                                        >
                                            Dashboard
                                        </Button>
                                        <Tooltip title="Account settings">
                                            <IconButton
                                                onClick={handleMenu}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            >
                                                <Avatar
                                                    alt={user?.name}
                                                    src={user?.avatar}
                                                    sx={{ width: 35, height: 35, bgcolor: 'primary.main' }}
                                                >
                                                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                                                </Avatar>
                                            </IconButton>
                                        </Tooltip>
                                        <UserMenu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => navigate('/guide')}
                                            sx={{ ...styles.navButton, ml: 2 }}
                                        >
                                            Guide
                                        </Button>
                                        <Button
                                            onClick={() => navigate('/login')}
                                            sx={{ ...styles.navButton, ml: 2 }}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate('/signup')}
                                            sx={styles.ctaButton}
                                        >
                                            Get Started
                                        </Button>
                                    </>
                                )}
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={styles.drawer}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default PublicNavbar;
