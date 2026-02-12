import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Tooltip,
    useMediaQuery,
    useTheme as useMuiTheme
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
    MenuBook as DocumentationIcon
} from "@mui/icons-material";
import TokenCountdown from "../components/TokenCountdown";
import UserSearch from "../components/UserSearch";
import UserMenu from "../components/UserMenu";

import { Theme } from "@mui/material";
import LandingFooter from "../components/landing/LandingFooter";

const drawerWidth = 240;

const privateLayoutStyles = {
    root: { display: 'flex', minHeight: '100vh' },
    drawerContentBox: { height: '100%', display: 'flex', flexDirection: 'column' },
    drawerHeaderToolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: [1] },
    drawerHeaderTitle: { ml: 2, fontWeight: 700, color: 'primary.main' },
    navList: { flexGrow: 1, px: 2, pt: 2 },
    navListItem: { display: 'block', mb: 1 },
    navListItemButton: (open: boolean, isActive: boolean, theme: Theme) => ({
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
        borderRadius: 1,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: isActive ? (theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.15)') : 'transparent',
        color: isActive ? 'primary.main' : 'text.primary',
        '& .MuiListItemIcon-root': { color: isActive ? 'primary.main' : 'inherit' },
        '&:hover': {
            transform: 'translateX(4px)',
            bgcolor: isActive ? 'primary.light' : 'action.hover',
            color: isActive ? 'white' : 'text.primary',
            '& .MuiListItemIcon-root': { color: isActive ? 'white' : 'inherit' }
        }
    }),
    navListItemIcon: (open: boolean) => ({ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }),
    navListItemText: (open: boolean) => ({ opacity: open ? 1 : 0 }),
    navListItemTextPrimary: { fontWeight: 700, fontSize: '0.9rem' },
    logoutButtonContainer: { p: 2 },
    logoutButton: {
        borderRadius: 1,
        color: 'error.main',
        transition: 'all 0.2s ease',
        '&:hover': {
            bgcolor: 'rgba(239, 68, 68, 0.1)',
            transform: 'translateX(4px)'
        }
    },
    appBar: (open: boolean, isMobile: boolean, theme: Theme) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && !isMobile && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary'
    }),
    menuButton: (open: boolean) => ({ marginRight: 5, ...(open && { display: 'none' }) }),
    title: { flexGrow: 1, fontWeight: 600 },
    topBarActions: { display: 'flex', alignItems: 'center', gap: 2 },
    avatarButton: { p: 0 },
    avatar: { width: 35, height: 35, bgcolor: 'primary.main' },
    drawer: (open: boolean, theme: Theme) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        ...(!open && {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
        }),
        [`& .MuiDrawer-paper`]: {
            position: 'fixed', // Explicitly ensure fixed if not already
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            ...(!open && {
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
    mainContent: {
        flexGrow: 1,
        p: { xs: 1, sm: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        mt: { xs: 7, md: 8 },
        bgcolor: 'background.default',
        width: '100%',
        overflowX: 'hidden'
    }
};

const PrivateLayout = () => {
    const { isAuthenticated, loading, logout, user, checkAuth, expiryTime } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

    // Default open to true on desktop, false on mobile
    const [open, setOpen] = useState(!isMobile);
    const location = useLocation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchOpen, setSearchOpen] = useState(false);

    // Synchronize open state with isMobile changes
    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/" replace />;

    const toggleDrawer = () => setOpen(!open);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Task Board', icon: <BoardIcon />, path: '/board' },
        { text: 'Social Feed', icon: <FeedIcon />, path: '/feed' },
        { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
        { text: 'Resume', icon: <ResumeIcon />, path: '/resume' },
        { text: 'Documentation', icon: <DocumentationIcon />, path: '/documentation' },
    ];

    const drawerContent = (
        <Box sx={privateLayoutStyles.drawerContentBox}>
            <Toolbar sx={privateLayoutStyles.drawerHeaderToolbar}>
                <Typography variant="h6" sx={privateLayoutStyles.drawerHeaderTitle}>
                    DevConnect
                </Typography>
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav" sx={privateLayoutStyles.navList}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={privateLayoutStyles.navListItem}>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={(theme) => privateLayoutStyles.navListItemButton(open, location.pathname === item.path, theme)}
                        >
                            <ListItemIcon sx={privateLayoutStyles.navListItemIcon(open)}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={privateLayoutStyles.navListItemText(open)} primaryTypographyProps={privateLayoutStyles.navListItemTextPrimary} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ opacity: 0.5 }} />
            <Box sx={privateLayoutStyles.logoutButtonContainer}>
                <ListItemButton
                    onClick={logout}
                    sx={privateLayoutStyles.logoutButton}
                >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    {open && <ListItemText primary="Logout" primaryTypographyProps={privateLayoutStyles.navListItemTextPrimary} />}
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={privateLayoutStyles.root}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={(theme) => privateLayoutStyles.appBar(open, isMobile, theme)}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        edge="start"
                        sx={{ mr: { xs: 1, md: 2 } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={privateLayoutStyles.title}>
                        {menuItems.find(i => i.path === location.pathname)?.text || 'Welcome'}
                    </Typography>

                    {isMobile ? (
                        searchOpen ? (
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                bgcolor: 'background.paper',
                                zIndex: 1200,
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                                gap: 1
                            }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <UserSearch />
                                </Box>
                                <IconButton onClick={() => setSearchOpen(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <IconButton color="inherit" onClick={() => setSearchOpen(true)} sx={{ ml: 'auto' }}>
                                <SearchIcon />
                            </IconButton>
                        )
                    ) : (
                        <UserSearch />
                    )}

                    <Box sx={{ ...privateLayoutStyles.topBarActions, gap: { xs: 0.5, sm: 2 } }}>
                        <TokenCountdown expiryTime={expiryTime} onExpire={checkAuth} />

                        <Tooltip title="Toggle Theme">
                            <IconButton onClick={toggleTheme} color="inherit" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                                {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={handleMenu}
                                size="small"
                                sx={privateLayoutStyles.avatarButton}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar alt={user?.name} src={user?.avatar} sx={privateLayoutStyles.avatar}>
                                    {user?.name?.[0]?.toUpperCase() || '?'}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <UserMenu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        />
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={open}
                onClose={isMobile ? toggleDrawer : undefined}
                sx={(theme) => privateLayoutStyles.drawer(open, theme)}
            >
                {drawerContent}
            </Drawer>

            <Box component="main" sx={privateLayoutStyles.mainContent}>
                <Outlet />
                <LandingFooter />

            </Box>
            
        </Box>
    );
};

export default PrivateLayout;
