import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
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
    Menu,
    MenuItem,
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
    Brightness7 as LightModeIcon
} from "@mui/icons-material";
import TokenCountdown from "../components/TokenCountdown";

const drawerWidth = 240;

const PrivateLayout = () => {
    const { isAuthenticated, loading, logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const toggleDrawer = () => setOpen(!open);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Task Board', icon: <BoardIcon />, path: '/board' },
        { text: 'Social Feed', icon: <FeedIcon />, path: '/feed' },
        { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    ];

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: [1] }}>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 700, color: 'primary.main' }}>
                    Global Dashboard
                </Typography>
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav" sx={{ flexGrow: 1, px: 2, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 1 }}>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                borderRadius: 3,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&.Mui-selected': {
                                    bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.15)',
                                    color: 'primary.main',
                                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                                    '&:hover': { bgcolor: 'primary.light', color: 'white', '& .MuiListItemIcon-root': { color: 'white' } }
                                },
                                '&:hover': {
                                    transform: 'translateX(4px)',
                                    bgcolor: 'action.hover',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ opacity: 0.5 }} />
            <Box sx={{ p: 2 }}>
                <ListItemButton
                    onClick={logout}
                    sx={{
                        borderRadius: 3,
                        color: 'error.main',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            transform: 'translateX(4px)'
                        }
                    }}
                >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    {open && <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />}
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: muiTheme.zIndex.drawer + 1,
                    transition: muiTheme.transitions.create(['width', 'margin'], {
                        easing: muiTheme.transitions.easing.sharp,
                        duration: muiTheme.transitions.duration.leavingScreen,
                    }),
                    ...(open && {
                        marginLeft: drawerWidth,
                        width: `calc(100% - ${drawerWidth}px)`,
                        transition: muiTheme.transitions.create(['width', 'margin'], {
                            easing: muiTheme.transitions.easing.sharp,
                            duration: muiTheme.transitions.duration.enteringScreen,
                        }),
                    }),
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        edge="start"
                        sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {menuItems.find(i => i.path === location.pathname)?.text || 'Welcome'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TokenCountdown expiryTime={useAuth().expiryTime} />

                        <Tooltip title="Toggle Theme">
                            <IconButton onClick={toggleTheme} color="inherit">
                                {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Account settings">
                            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                                <Avatar alt={user?.email} src="/static/images/avatar/2.jpg" sx={{ width: 35, height: 35, bgcolor: 'primary.main' }}>
                                    {user?.email?.[0].toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
                            <MenuItem onClick={() => { handleClose(); logout(); }}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={open}
                onClose={toggleDrawer}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-grow',
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        transition: muiTheme.transitions.create('width', {
                            easing: muiTheme.transitions.easing.sharp,
                            duration: muiTheme.transitions.duration.enteringScreen,
                        }),
                        overflowX: 'hidden',
                        ...(!open && {
                            transition: muiTheme.transitions.create('width', {
                                easing: muiTheme.transitions.easing.sharp,
                                duration: muiTheme.transitions.duration.leavingScreen,
                            }),
                            width: muiTheme.spacing(7),
                            [muiTheme.breakpoints.up('sm')]: {
                                width: muiTheme.spacing(9),
                            },
                        }),
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: 'background.default' }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default PrivateLayout;
