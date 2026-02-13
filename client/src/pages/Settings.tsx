import React from "react";
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Switch,
    Divider,
    Button,
    Container,
    Avatar,
    Stack
} from "@mui/material";
import {
    Settings as SettingsIcon,
    Favorite as FavoriteIcon,
    Comment as CommentIcon,
    Security as SecurityIcon,
    Notifications as NotificationsIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    ChevronRight as ChevronRightIcon,
    Person as PersonIcon
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

interface SettingItem {
    text: string;
    icon: React.ReactNode;
    subtext: string;
    onClick?: () => void;
    action?: React.ReactNode;
}

interface SettingSection {
    title: string;
    items: SettingItem[];
}

const Settings = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const sections: SettingSection[] = [
        {
            title: "Activities",
            items: [
                { text: "My Likes", icon: <FavoriteIcon color="error" />, subtext: "View all posts you've liked", onClick: () => navigate("/settings/likes") },
                { text: "My Comments", icon: <CommentIcon color="primary" />, subtext: "Posts you've shared thoughts on", onClick: () => navigate("/settings/comments") }
            ]
        },
        {
            title: "Preferences",
            items: [
                {
                    text: "Appearance",
                    icon: theme === 'light' ? <LightModeIcon sx={{ color: '#EAB308' }} /> : <DarkModeIcon sx={{ color: '#818CF8' }} />,
                    subtext: `${theme.charAt(0).toUpperCase() + theme.slice(1)} mode enabled`,
                    action: <Switch checked={theme === 'dark'} onChange={toggleTheme} />
                },
                { text: "Notifications", icon: <NotificationsIcon color="action" />, subtext: "Manage email and push alerts" }
            ]
        },
        {
            title: "Security",
            items: [
                { text: "Account Security", icon: <SecurityIcon color="success" />, subtext: "Manage password and 2FA" },
                { text: "Privacy", icon: <PersonIcon color="info" />, subtext: "Control who sees your profile" }
            ]
        }
    ];

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: '1.5rem', fontWeight: 800 }}
                >
                    <SettingsIcon />
                </Avatar>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Settings</Typography>
                    <Typography variant="body2" color="text.secondary">Manage your account and view your activity</Typography>
                </Box>
            </Box>

            <Paper sx={{ p: 4, mb: 4, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Avatar
                    src={user?.avatar}
                    sx={{ width: 80, height: 80, border: '4px solid rgba(255,255,255,0.3)' }}
                >
                    {user?.name?.[0]}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>{user?.email}</Typography>
                </Box>
                <Button variant="contained" color="inherit" onClick={() => navigate("/profile")} sx={{ color: 'primary.main', fontWeight: 700, borderRadius: 10 }}>
                    View Profile
                </Button>
            </Paper>

            <Stack spacing={3}>
                {sections.map((section) => (
                    <Box key={section.title}>
                        <Typography variant="overline" sx={{ px: 2, fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>
                            {section.title}
                        </Typography>
                        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                            <List disablePadding>
                                {section.items.map((item, index) => (
                                    <React.Fragment key={item.text}>
                                        <ListItem
                                            disablePadding
                                            secondaryAction={item.action || (item.onClick && <ChevronRightIcon color="disabled" />)}
                                        >
                                            <ListItemButton
                                                onClick={item.onClick}
                                                disabled={!item.onClick && !item.action}
                                                sx={{ py: 2, px: 3 }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 48 }}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.text}
                                                    secondary={item.subtext}
                                                    primaryTypographyProps={{ fontWeight: 700 }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        {index < section.items.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Box>
                ))}
            </Stack>
        </Container>
    );
};

export default Settings;
