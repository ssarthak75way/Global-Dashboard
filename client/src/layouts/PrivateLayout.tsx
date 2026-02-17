import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import {
    Box,
    AppBar,
    Toolbar,
    List,
    Typography,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Tooltip,
    useMediaQuery,
    useTheme as useMuiTheme,
    Fade
} from "@mui/material";
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    Assignment as BoardIcon,
    Person as ProfileIcon,
    Forum as FeedIcon,
    Logout as LogoutIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Description as ResumeIcon,
    Home as HomeIcon,
    MenuBook as DocumentationIcon,
    Chat as ChatIcon,
    Settings as SettingsIcon,
    Code as DevIcon,
    AllInclusive as AllInclusiveIcon
} from "@mui/icons-material";
import TokenCountdown from "../components/TokenCountdown";
import UserSearch from "../components/UserSearch";
import UserMenu from "../components/UserMenu";
import React from 'react';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 88;

const PrivateLayout = () => {
    const { isAuthenticated, loading, logout, user, checkAuth, expiryTime } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const isTablet = useMediaQuery(muiTheme.breakpoints.down('lg'));

    const [open, setOpen] = useState(!isTablet);
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        setOpen(!isTablet);
    }, [isTablet]);

    if (loading) return null; // Or a sleek loader
    if (!isAuthenticated) return <Navigate to="/" replace />;

    const toggleDrawer = () => setOpen(!open);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Task Board', icon: <BoardIcon />, path: '/board' },
        { text: 'Social Feed', icon: <FeedIcon />, path: '/feed' },
        { text: 'Messages', icon: <ChatIcon />, path: '/messages' },
        { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
        { text: 'Resume', icon: <ResumeIcon />, path: '/resume' },
        { text: 'Documentation', icon: <DocumentationIcon />, path: '/documentation' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
        { text: 'Infinitive', icon: <AllInclusiveIcon />, path: '/infinite' },
    ];

    const currentTitle = menuItems.find(i => i.path === location.pathname)?.text || 'DevConnect';

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Sidebar */}
            <Box
                component="nav"
                sx={{
                    width: { xs: 0, md: open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH },
                    flexShrink: 0,
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: { xs: 'fixed', md: 'sticky' },
                    top: 0,
                    height: '100vh',
                    zIndex: 1200,
                    ...(isMobile && open && { width: '100%', bgcolor: 'background.default' })
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.paper',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    {/* Sidebar Header */}
                    <Box sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: open ? 'space-between' : 'center',
                        height: 80
                    }}>
                        {open ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ bgcolor: theme === 'dark' ? '#BB86FC' : 'common.black', width: 32, height: 32 }}>
                                    <DevIcon sx={{ fontSize: 20, color: theme === 'dark' ? 'common.black' : 'common.white' }} />
                                </Avatar>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                    MyBoard
                                </Typography>
                            </Box>
                        ) : (
                            <Avatar sx={{ bgcolor: theme === 'dark' ? '#BB86FC' : 'common.black', width: 40, height: 40 }}>
                                <DevIcon sx={{ color: theme === 'dark' ? 'common.black' : 'common.white' }} />
                            </Avatar>
                        )}
                        {open && !isMobile && (
                            <IconButton onClick={toggleDrawer} size="small" sx={{ color: 'text.secondary' }}>
                                <ChevronLeftIcon />
                            </IconButton>
                        )}
                        {isMobile && (
                            <IconButton onClick={toggleDrawer}>
                                <CloseIcon />
                            </IconButton>
                        )}
                    </Box>

                    {/* Navigation Items */}
                    <List sx={{ px: 2, flexGrow: 1, overflowY: 'auto' }}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <ListItem key={item.text} disablePadding sx={{ mb: 1, display: 'block' }}>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        onClick={() => isMobile && setOpen(false)}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                            mx: 1,
                                            borderRadius: '30px', // Pill shape from reference
                                            bgcolor: isActive
                                                ? (theme === 'dark' ? '#BB86FC' : 'common.black')
                                                : 'transparent',
                                            color: isActive
                                                ? (theme === 'dark' ? 'common.black' : 'common.white')
                                                : 'text.secondary',
                                            '&:hover': {
                                                bgcolor: isActive
                                                    ? (theme === 'dark' ? '#BB86FC' : 'common.black')
                                                    : 'action.hover',
                                                color: isActive
                                                    ? (theme === 'dark' ? 'common.black' : 'common.white')
                                                    : 'text.primary',
                                                transform: 'translateX(4px)'
                                            },
                                            '& .MuiListItemIcon-root': {
                                                color: isActive
                                                    ? (theme === 'dark' ? 'common.black' : 'common.white')
                                                    : 'inherit'
                                            },
                                            transition: 'all 0.2s',
                                            boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 2 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            sx={{
                                                opacity: open ? 1 : 0,
                                                display: open ? 'block' : 'none',
                                                '& .MuiTypography-root': { fontWeight: isActive ? 700 : 500 }
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>

                    {/* Footer Actions */}
                    <Box sx={{ p: 2 }}>
                        <ListItemButton
                            onClick={logout}
                            sx={{
                                justifyContent: open ? 'flex-start' : 'center',
                                borderRadius: '30px',
                                color: 'error.main',
                                '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, color: 'inherit' }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            {open && <ListItemText primary="Logout" />}
                        </ListItemButton>
                    </Box>
                </Box>
            </Box>

            {/* Main Content Area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { width: `calc(100% - ${open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH}px)` } }}>
                {/* Topbar */}
                <AppBar
                    position="sticky"
                    color="transparent"
                    elevation={0}
                    sx={{
                        backdropFilter: 'blur(20px)',
                        bgcolor: theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(17,24,39,0.8)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        top: 0
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between', height: 80 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {!open && !isMobile && (
                                <IconButton onClick={toggleDrawer} edge="start" color="inherit">
                                    <MenuIcon />
                                </IconButton>
                            )}
                            {isMobile && (
                                <IconButton onClick={toggleDrawer} edge="start" color="inherit">
                                    <MenuIcon />
                                </IconButton>
                            )}
                            <Box>
                                <Typography variant="h4" color="text.primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    {currentTitle}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Search and Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {isMobile ? (
                                searchOpen ? (
                                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'background.paper', zIndex: 10, display: 'flex', alignItems: 'center', px: 2 }}>
                                        <Box sx={{ flexGrow: 1 }}><UserSearch /></Box>
                                        <IconButton onClick={() => setSearchOpen(false)}><CloseIcon /></IconButton>
                                    </Box>
                                ) : (
                                    <IconButton onClick={() => setSearchOpen(true)}><SearchIcon /></IconButton>
                                )
                            ) : (
                                <UserSearch />
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TokenCountdown expiryTime={expiryTime} onExpire={checkAuth} />
                                <Tooltip title="Toggle Theme">
                                    <IconButton onClick={toggleTheme} color="inherit">
                                        {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Account">
                                    <IconButton onClick={handleMenu} size="small" sx={{ ml: 1 }}>
                                        <Avatar
                                            src={user?.avatar}
                                            alt={user?.name}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                border: '2px solid',
                                                borderColor: 'primary.main',
                                                bgcolor: 'primary.light'
                                            }}
                                        >
                                            {user?.name?.[0]?.toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <UserMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} />
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: { xs: 2, md: 4 },
                        overflowX: 'hidden',
                        position: 'relative'
                    }}
                >
                    <Fade in timeout={500}>
                        <Box>
                            <Outlet />
                        </Box>
                    </Fade>
                </Box>
            </Box>
        </Box>
    );
};

export default PrivateLayout;
