import React from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Typography,
    Box,
    useTheme
} from '@mui/material';
import {
    Person as ProfileIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    KeyboardArrowRight as ArrowIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UserMenuProps {
    anchorEl: null | HTMLElement;
    open: boolean;
    onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ anchorEl, open, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    const styles = {
        menu: {
            '& .MuiPaper-root': {
                overflow: 'visible',
                filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.15))',
                mt: 1.5,
                borderRadius: 3,
                minWidth: 260,
                bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(30, 30, 30, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                padding: '8px',
                '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 20,
                    width: 12,
                    height: 12,
                    bgcolor: theme.palette.mode === 'dark'
                        ? 'rgba(30, 30, 30, 0.8)'
                        : 'white',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    borderLeft: '1px solid',
                    borderTop: '1px solid',
                    borderColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                },
            },
        },
        header: {
            px: 2,
            py: 2,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 2,
            background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        },
        avatar: {
            width: 52,
            height: 52,
            border: '2px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'scale(1.05)'
            }
        },
        name: {
            fontWeight: 800,
            fontSize: '1rem',
            color: theme.palette.text.primary,
            lineHeight: 1.2
        },
        email: {
            fontSize: '0.75rem',
            color: theme.palette.text.secondary,
            mt: 0.2
        },
        menuItem: {
            borderRadius: 1.5,
            py: 1.2,
            px: 1.5,
            my: 0.5,
            transition: 'all 0.2s ease',
            '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                    color: 'white',
                },
                '& .MuiSvgIcon-root.arrow': {
                    opacity: 1,
                    transform: 'translateX(0)'
                }
            }
        },
        icon: {
            minWidth: '36px !important',
            color: 'primary.main',
        },
        arrowIcon: {
            fontSize: '1.2rem',
            opacity: 0,
            transform: 'translateX(-10px)',
            transition: 'all 0.2s ease',
            ml: 'auto'
        },
        logoutItem: {
            borderRadius: 1.5,
            py: 1.2,
            px: 1.5,
            mt: 1,
            transition: 'all 0.2s ease',
            color: 'error.main',
            '&:hover': {
                bgcolor: 'error.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                    color: 'white',
                }
            }
        }
    };

    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            onClick={onClose}
            sx={styles.menu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {/* User Profile Header */}
            <Box sx={styles.header}>
                <Avatar
                    alt={user?.name}
                    src={user?.avatar}
                    sx={styles.avatar}
                >
                    {user?.name?.[0]?.toUpperCase() || '?'}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography noWrap sx={styles.name}>
                        {user?.name || 'User'}
                    </Typography>
                    <Typography noWrap sx={styles.email}>
                        {user?.email}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ px: 1 }}>
                <MenuItem onClick={() => handleNavigate('/profile')} sx={styles.menuItem}>
                    <ListItemIcon sx={styles.icon}>
                        <ProfileIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        primary="My Profile"
                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                    />
                    <ArrowIcon className="arrow" sx={styles.arrowIcon} />
                </MenuItem>

                <MenuItem onClick={() => handleNavigate('/settings')} sx={styles.menuItem}>
                    <ListItemIcon sx={styles.icon}>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Settings"
                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                    />
                    <ArrowIcon className="arrow" sx={styles.arrowIcon} />
                </MenuItem>

                <Divider sx={{ my: 1, opacity: 0.6 }} />

                <MenuItem onClick={handleLogout} sx={styles.logoutItem}>
                    <ListItemIcon sx={{ minWidth: '36px !important', color: 'inherit' }}>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }}
                    />
                </MenuItem>
            </Box>
        </Menu>
    );
};

export default UserMenu;
