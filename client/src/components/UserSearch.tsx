import { useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Paper,
    ClickAwayListener,
    Fade,
    ListItemButton
} from '@mui/material';
import Loader from './Loader';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../services/socialService';
import { User } from '../context/AuthContext';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }

        setLoading(true);
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await searchUsers(query);
                setResults(response.data);
                setOpen(true);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [query]);

    const handleUserClick = (userId: string) => {
        navigate(`/profile/${userId}`);
        setOpen(false);
        setQuery('');
    };

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box sx={{ position: 'relative', width: { xs: '100%', sm: 300, md: 400 }, mr: { xs: 0, sm: 2 } }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: loading && (
                            <InputAdornment position="end">
                                <Loader size={20} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            '& fieldset': { border: 'none' },
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s',
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }
                        }
                    }}
                />

                <Fade in={open && (results.length > 0 || loading)}>
                    <Paper
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            mt: 1,
                            zIndex: 1300,
                            maxHeight: 400,
                            overflow: 'auto',
                            borderRadius: 1,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        }}
                    >
                        <List>
                            {results.length > 0 ? (
                                results.map((user) => (
                                    <ListItem
                                        key={user._id}
                                        disablePadding
                                    >
                                        <ListItemButton
                                            onClick={() => handleUserClick(user._id)}
                                            sx={{
                                                borderRadius: 1,
                                                mx: 1,
                                                width: 'auto',
                                                mb: 0.5,
                                                '&:hover': { bgcolor: 'action.hover' }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        {user.name || user.email.split('@')[0]}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="caption" color="text.secondary">
                                                        {user.email}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            ) : (
                                !loading && query && (
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No users found
                                        </Typography>
                                    </Box>
                                )
                            )}
                        </List>
                    </Paper>
                </Fade>
            </Box>
        </ClickAwayListener>
    );
};

export default UserSearch;
