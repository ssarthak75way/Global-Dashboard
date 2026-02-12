import {
    Box,
    Paper,
    Avatar,
    TextField,
    Button,
    Stack,
    IconButton,
    Theme
} from "@mui/material";
import {
    Create as CreateIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    PhotoCamera,
} from "@mui/icons-material";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Loader from "../Loader"; 

interface CreatePostProps {
    user: any;
    title: string;
    setTitle: (title: string) => void;
    content: string;
    setContent: (content: string) => void;
    handleCreatePost: (e: React.FormEvent) => void;
    submitting: boolean;
    uploading: boolean;
    imageUrl: string | null;
    setImageUrl: (url: string | null) => void;
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
    editingPostId: string | null;
    resetForm: () => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreatePost = ({
    user,
    title,
    setTitle,
    content,
    setContent,
    handleCreatePost,
    submitting,
    uploading,
    imageUrl,
    setImageUrl,
    isExpanded,
    setIsExpanded,
    editingPostId,
    resetForm,
    handleImageUpload
}: CreatePostProps) => {

    // Simplified toolbar for mobile could be considered, but CSS wrapping is handled below
    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    };

    const styles = {
        createPostPaper: {
            p: { xs: 2, sm: 3 },
            mb: { xs: 4, sm: 6 },
            borderRadius: 2, // Consistent border radius
            // Removed negative mx to fit within container
            border: "1px solid",
            borderColor: isExpanded ? "primary.main" : "divider",
            bgcolor: (theme: Theme) => theme.palette.mode === "light" ? "background.paper" : "rgba(255,255,255,0.05)",
            transition: "all 0.3s ease",
            boxShadow: isExpanded ? "0 8px 32px rgba(0,0,0,0.1)" : "none"
        },
        createPostCollapsedStack: {
            cursor: "text",
            width: "100%"
        },
        createPostAvatar: {
            bgcolor: "primary.main",
            fontWeight: 700,
            width: { xs: 32, sm: 40 }, // Slightly larger on mobile for touch
            height: { xs: 32, sm: 40 },
            fontSize: { xs: '0.9rem', sm: '1rem' }
        },
        createPostPlaceholder: {
            flexGrow: 1,
            color: "text.secondary",
            fontSize: { xs: "0.9rem", sm: "1.1rem" }, // Improved readability
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
        },
        createPostAddIcon: {
            border: "1px solid",
            borderColor: "primary.light",
            p: 1
        },
        createPostFormStack: { mb: 2 },
        createPostTitleInput: {
            "& .MuiInput-root": {
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                fontWeight: 900
            }
        },
        qlContainerBox: {
            mb: 3,
            "& .ql-container": {
                border: "none",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                minHeight: "120px"
            },
            "& .ql-toolbar": {
                border: "none",
                borderTop: "1px solid",
                borderColor: "divider",
                mt: 2,
                px: { xs: 0, sm: 1 },
                display: "flex",
                flexWrap: "wrap",
                height: "auto",
                "& .ql-formats": {
                    marginRight: "8px !important",
                    marginBottom: "4px !important"
                }
            },
            "& .ql-editor": {
                px: { xs: 0, sm: 2 } // Remove padding on mobile to maximize space
            }
        },
        imagePreviewBox: {
            mb: 2,
            position: "relative",
            width: "100%", // Responsive width
            maxWidth: "fit-content"
        },
        imagePreviewImage: {
            maxWidth: "100%",
            maxHeight: "300px",
            borderRadius: "12px",
            display: "block"
        },
        imagePreviewCancel: {
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
        },
        actionButtonsBox: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            flexWrap: "wrap", // Allow wrapping
            gap: 2
        },
        uploadButton: {
            borderRadius: "20px",
            textTransform: "none",
            width: { xs: "100%", sm: "auto" } // Full width on mobile
        },
        submitButton: {
            borderRadius: "20px",
            px: 4,
            fontWeight: 700,
            textTransform: "none",
            width: { xs: "100%", sm: "auto" }
        },
    };

    return (
        <Paper elevation={0} sx={styles.createPostPaper}>
            {!isExpanded ? (
                <Stack direction="row" spacing={2} alignItems="center" onClick={() => setIsExpanded(true)} sx={styles.createPostCollapsedStack}>
                    {/* <Avatar sx={styles.createPostAvatar}>
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                    </Avatar> */}
                    <Avatar src={user?.avatar}
                    >
                        {!user?.avatar && (user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?')}
                    </Avatar>

                    <Box sx={styles.createPostPlaceholder}>
                        {editingPostId ? "Editing your story..." : "What's on your mind?"}
                    </Box>
                    <IconButton color="primary" sx={styles.createPostAddIcon}>
                        <AddIcon />
                    </IconButton>
                </Stack>
            ) : (
                <Box component="form" onSubmit={handleCreatePost}>
                    <Stack direction="row" spacing={2} sx={styles.createPostFormStack}>
                        <TextField
                            fullWidth
                            placeholder="Title..."
                            variant="standard"
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={styles.createPostTitleInput}
                            InputProps={{ disableUnderline: true }}
                        />
                        <IconButton onClick={resetForm} size="small">
                            <CancelIcon />
                        </IconButton>
                    </Stack>

                    <Box sx={styles.qlContainerBox}>
                        <ReactQuill
                            theme="snow"
                            className="ql-editor"
                            value={content}
                            onChange={setContent}
                            modules={quillModules}
                            placeholder="Tell your story..."
                        />
                    </Box>

                    {imageUrl && (
                        <Box sx={styles.imagePreviewBox}>
                            <img src={imageUrl} alt="Preview" style={styles.imagePreviewImage} />
                            <IconButton
                                size="small"
                                onClick={() => setImageUrl(null)}
                                sx={styles.imagePreviewCancel}
                            >
                                <CancelIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    )}

                    <Box sx={styles.actionButtonsBox}>
                        <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                            <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="icon-button-file"
                                type="file"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="icon-button-file">
                                <Button
                                    component="span"
                                    variant="outlined"
                                    startIcon={uploading ? <Loader size={20} /> : <PhotoCamera />}
                                    disabled={uploading}
                                    sx={styles.uploadButton}
                                >
                                    {uploading ? "Uploading..." : "Add Image"}
                                </Button>
                            </label>
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting || uploading || !title.trim() || !content.trim() || content === "<p><br></p>"}
                            startIcon={submitting ? <Loader size={20} /> : <CreateIcon />}
                            sx={styles.submitButton}
                        >
                            {editingPostId ? "Update Story" : "Publish"}
                        </Button>
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

export default CreatePost;