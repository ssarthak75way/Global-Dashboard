import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    useMediaQuery,
    useTheme,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Paper,
    Typography,
    CircularProgress
} from "@mui/material";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState, useRef, useEffect } from "react";
import { searchUsersForChat } from "../../services/chatService";

interface User {
    _id: string;
    name: string;
    avatar: string;
    email: string;
}

interface CommentModalProps {
    open: boolean;
    onClose: () => void;
    commentText: string;
    setCommentText: (text: string) => void;
    handleComment: () => void;
}

const CommentModal = ({
    open,
    onClose,
    commentText,
    setCommentText,
    handleComment
}: CommentModalProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const quillRef = useRef<any>(null);
    const searchTimeout = useRef<any>(null);

    const [mentionUsers, setMentionUsers] = useState<User[]>([]);
    const [mentionLoading, setMentionLoading] = useState(false);
    const [showMentions, setShowMentions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, []);

    useEffect(() => {
        if (!open) {
            setShowMentions(false);
            setMentionUsers([]);
            setSelectedIndex(0);
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        }
    }, [open]);

    const handleMentionSearch = async (query: string) => {
        setMentionLoading(true);
        try {
            const response = await searchUsersForChat(query);
            if (response.success) {
                setMentionUsers(response.data);
                setSelectedIndex(0);
            }
        } catch (error) {
            console.error("Mention search failed", error);
        } finally {
            setMentionLoading(false);
        }
    };

    const handleChange = (content: string, _delta: any, _source: any, editor: any) => {
        setCommentText(content);
        const selection = editor.getSelection();
        if (!selection) return;

        const text = editor.getText();
        const cursorPosition = selection.index;
        const textBeforeCursor = text.slice(0, cursorPosition);
        const lastAt = textBeforeCursor.lastIndexOf('@');

        if (lastAt !== -1 && (lastAt === 0 || textBeforeCursor[lastAt - 1] === ' ' || textBeforeCursor[lastAt - 1] === '\n')) {
            const query = textBeforeCursor.slice(lastAt + 1);
            if (!query.includes(' ')) {
                setShowMentions(true);

                // Position the dropdown near the cursor
                const bounds = editor.getBounds(cursorPosition);
                setMentionPosition({ top: bounds.top + bounds.height + 10, left: bounds.left });

                if (searchTimeout.current) clearTimeout(searchTimeout.current);
                searchTimeout.current = setTimeout(() => {
                    handleMentionSearch(query);
                }, 300);
                return;
            }
        }
        setShowMentions(false);
    };

    const handleMentionSelect = (user: User) => {
        const quill = quillRef.current.getEditor();
        const selection = quill.getSelection();
        if (!selection) return;

        const cursorPosition = selection.index;
        const text = quill.getText();
        const textBeforeCursor = text.slice(0, cursorPosition);
        const lastAt = textBeforeCursor.lastIndexOf('@');

        // Delete trigger and insert mention
        quill.deleteText(lastAt, cursorPosition - lastAt);
        quill.insertText(lastAt, `@${user.name} `, {
            bold: true,
            color: theme.palette.primary.main
        });

        // Move focus back to editor
        quill.focus();
        setShowMentions(false);
    };

    const handleKeyDown = (e: any) => {
        if (!showMentions || mentionUsers.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % mentionUsers.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + mentionUsers.length) % mentionUsers.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleMentionSelect(mentionUsers[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowMentions(false);
        }
    };

    const styles = {
        dialogTitle: {
            fontWeight: 800,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            pb: 1
        },
        dialogQuillBox: {
            mt: 1,
            position: 'relative',
            "& .ql-container": {
                minHeight: "180px",
                fontSize: "1rem",
                borderRadius: '0 0 12px 12px',
                border: '1px solid',
                borderColor: 'divider'
            },
            "& .ql-toolbar": {
                borderRadius: '12px 12px 0 0',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'action.hover'
            },
            "& .ql-editor": {
                minHeight: "180px",
                "& blockquote": {
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    pl: 2,
                    bgcolor: 'action.hover',
                    py: 1
                }
            }
        },
        mentionListPaper: {
            position: 'absolute',
            zIndex: 1000,
            width: '280px',
            maxHeight: '240px',
            overflow: 'auto',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(20px)',
            background: theme.palette.mode === 'dark'
                ? 'rgba(30,30,30,0.9)'
                : 'rgba(255,255,255,0.9)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.2s ease'
        },
        dialogActions: {
            p: { xs: 2, sm: 3 },
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            gap: 1
        },
        respondButton: {
            borderRadius: "20px",
            fontWeight: 800,
            width: { xs: '100%', sm: 'auto' },
            px: 4,
            py: 1,
            textTransform: 'none',
            boxShadow: theme.shadows[4]
        },
        cancelButton: {
            width: { xs: '100%', sm: 'auto' },
            borderRadius: "20px",
            fontWeight: 700,
            textTransform: 'none',
            py: 1
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            fullScreen={fullScreen}
            PaperProps={{
                sx: { borderRadius: { sm: 4 } }
            }}
        >
            <DialogTitle sx={styles.dialogTitle}>Join the conversation</DialogTitle>
            <DialogContent dividers sx={{ borderBottom: 'none' }}>
                <Box sx={styles.dialogQuillBox}>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={commentText}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline', 'blockquote'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link', 'clean']
                            ]
                        }}
                        placeholder="Share your thoughts... use @ to mention friends"
                    />
                    {showMentions && (mentionUsers.length > 0 || mentionLoading) && (
                        <Paper
                            sx={{
                                ...styles.mentionListPaper,
                                top: mentionPosition.top,
                                left: mentionPosition.left
                            }}
                        >
                            {mentionLoading && (
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <CircularProgress size={16} />
                                    <Typography variant="caption" color="text.secondary">Searching...</Typography>
                                </Box>
                            )}
                            <List dense sx={{ p: 1 }}>
                                {mentionUsers.map((user, index) => (
                                    <ListItemButton
                                        key={user._id}
                                        onClick={() => handleMentionSelect(user)}
                                        selected={index === selectedIndex}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 0.5,
                                            '&.Mui-selected': {
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                '&:hover': { bgcolor: 'primary.dark' },
                                                '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                                            }
                                        }}
                                    >
                                        <ListItemAvatar sx={{ minWidth: 40 }}>
                                            <Avatar src={user.avatar} sx={{ width: 32, height: 32, border: '1px solid rgba(0,0,0,0.1)' }}>
                                                {user.name[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={user.email}
                                            primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }}
                                            secondaryTypographyProps={{ fontSize: '0.75rem', noWrap: true }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={styles.dialogActions}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    sx={styles.cancelButton}
                >
                    Dismiss
                </Button>
                <Button
                    onClick={handleComment}
                    variant="contained"
                    disabled={!commentText.trim() || commentText === "<p><br></p>" || mentionLoading}
                    sx={styles.respondButton}
                >
                    Post Comment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommentModal;