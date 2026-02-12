import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    useMediaQuery,
    useTheme
} from "@mui/material";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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

    const styles = {
        dialogTitle: { 
            fontWeight: 800, 
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            pb: 1
        },
        dialogQuillBox: {
            mt: 1,
            "& .ql-container": {
                minHeight: "150px", // Good height for typing
                fontSize: "1rem"
            },
            "& .ql-editor": {
                minHeight: "150px"
            }
        },
        dialogActions: { 
            p: { xs: 2, sm: 3 },
            flexDirection: { xs: 'column-reverse', sm: 'row' }, // Stack buttons on mobile
            gap: 1
        },
        respondButton: { 
            borderRadius: "20px", 
            fontWeight: 700, 
            width: { xs: '100%', sm: 'auto' },
            py: 1
        },
        cancelButton: {
            width: { xs: '100%', sm: 'auto' },
            borderRadius: "20px",
            py: 1
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            fullScreen={fullScreen} // Full screen on mobile for better keyboard experience
        >
            <DialogTitle sx={styles.dialogTitle}>Write a response</DialogTitle>
            <DialogContent dividers>
                <Box sx={styles.dialogQuillBox}>
                    <ReactQuill
                        theme="snow"
                        value={commentText}
                        onChange={setCommentText}
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline'],
                                ['link', 'clean']
                            ]
                        }}
                        placeholder="What are your thoughts?"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={styles.dialogActions}>
                <Button 
                    onClick={onClose} 
                    color="inherit" 
                    sx={styles.cancelButton}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleComment}
                    variant="contained"
                    disabled={!commentText.trim() || commentText === "<p><br></p>"}
                    sx={styles.respondButton}
                >
                    Respond
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommentModal;