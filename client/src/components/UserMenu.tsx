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
    Logout as LogoutIcon
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

    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            onClick={onClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    borderRadius: 3,
                    minWidth: 220,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        borderLeft: '1px solid',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                    alt={user?.name}
                    src="/static/images/avatar/2.jpg"
                    sx={{ width: '40px !important', height: '40px !important' }}
                >
                    {user?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                        {user?.name || 'User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.75rem' }}>
                        {user?.email}
                    </Typography>
                </Box>
            </Box>
            <Divider />
            <MenuItem onClick={() => handleNavigate('/profile')} sx={{ py: 1.5 }}>
                <ListItemIcon>
                    <ProfileIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </MenuItem>
        </Menu>
    );
};

export default UserMenu;
