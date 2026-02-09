import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Avatar,
    TextField,
    Button,
    Stack,
    Divider,
    IconButton,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Fade,
    Collapse,
    Grow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from "@mui/material";
import {
    Favorite as LikeIcon,
    FavoriteBorder as LikeBorderIcon,
    ChatBubbleOutline as CommentIcon,
    Create as CreateIcon,
    Cancel as CancelIcon,
    AccessTime as TimeIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PhotoCamera
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { formatDistanceToNow } from "date-fns";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Comment {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    text: string;
    createdAt: string;
}

interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        name: string;
        email: string;
    };
    imageUrl?: string;
    likes: string[];
    comments: Comment[];
    createdAt: string;
}

const Feed = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

    // Comment Modal State
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");

    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    };

    const fetchPosts = async () => {
        try {
            const { data } = await api.get("/posts");
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setSubmitting(true);
        try {
            if (editingPostId) {
                const { data } = await api.put(`/posts/${editingPostId}`, { title, content, imageUrl });
                setPosts(posts.map(p => p._id === editingPostId ? data : p));
            } else {
                const { data } = await api.post("/posts", { title, content, imageUrl });
                setPosts([data, ...posts]);
            }
            resetForm();
        } catch (error) {
            console.error("Failed to save post", error);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setImageUrl(null);
        setIsExpanded(false);
        setEditingPostId(null);
    };

    const handleEditInitiate = (post: Post) => {
        setTitle(post.title);
        setContent(post.content);
        setImageUrl(post.imageUrl || null);
        setEditingPostId(post._id);
        setIsExpanded(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (postId: string) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/posts/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const { data } = await api.post("/posts/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setImageUrl(data.imageUrl);
        } catch (error) {
            console.error("Image upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            const { data } = await api.post(`/posts/${postId}/like`);
            setPosts(posts.map(p => p._id === postId ? { ...p, likes: data.likes } : p));
        } catch (error) {
            console.error("Failed to like post", error);
        }
    };

    const handleComment = async () => {
        if (!activeCommentPostId || !commentText.trim() || commentText === "<p><br></p>") return;
        try {
            const { data } = await api.post(`/posts/${activeCommentPostId}/comment`, { text: commentText });
            setPosts(posts.map(p => p._id === activeCommentPostId ? data : p));
            handleCloseCommentModal();
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const openCommentModal = (postId: string) => {
        setActiveCommentPostId(postId);
        setCommentText("");
        setCommentModalOpen(true);
    };

    const handleCloseCommentModal = () => {
        setCommentModalOpen(false);
        setActiveCommentPostId(null);
        setCommentText("");
    };

    const toggleComments = (postId: string) => {
        setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    if (loading) return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Fade in timeout={800}>
            <Box sx={{ maxWidth: 800, mx: "auto", pb: 8 }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1.5, mb: 1 }}>
                        Social Feed
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Share your engineering journey and connect with others.
                    </Typography>
                </Box>

                {/* Create Post */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 6,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: isExpanded ? "primary.main" : "divider",
                        bgcolor: theme => theme.palette.mode === "light" ? "white" : "rgba(255,255,255,0.03)",
                        transition: "all 0.3s ease",
                        boxShadow: isExpanded ? "0 8px 32px rgba(0,0,0,0.1)" : "none"
                    }}
                >
                    {!isExpanded ? (
                        <Stack direction="row" spacing={2} alignItems="center" onClick={() => setIsExpanded(true)} sx={{ cursor: "text" }}>
                            <Avatar sx={{ bgcolor: "primary.main", fontWeight: 700 }}>
                                {user?.email[0].toUpperCase()}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, color: "text.secondary", fontSize: "1.1rem" }}>
                                {editingPostId ? "Editing your story..." : "What's on your mind?"}
                            </Box>
                            <IconButton color="primary" sx={{ border: "1px solid", borderColor: "primary.light" }}>
                                <AddIcon />
                            </IconButton>
                        </Stack>
                    ) : (
                        <Box component="form" onSubmit={handleCreatePost}>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Title of your story..."
                                    variant="standard"
                                    autoFocus
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    sx={{ "& .MuiInput-root": { fontSize: "1.5rem", fontWeight: 900 } }}
                                    InputProps={{ disableUnderline: true }}
                                />
                                <IconButton onClick={resetForm} size="small">
                                    <CancelIcon />
                                </IconButton>
                            </Stack>

                            <Box sx={{
                                mb: 3,
                                "& .ql-container": { border: "none", fontSize: "1.1rem", minHeight: "150px" },
                                "& .ql-toolbar": { border: "none", borderTop: "1px solid", borderColor: "divider", mt: 2 }
                            }}>
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
                                <Box sx={{ mb: 2, position: "relative", width: "fit-content" }}>
                                    <img src={imageUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "12px" }} />
                                    <IconButton
                                        size="small"
                                        onClick={() => setImageUrl(null)}
                                        sx={{ position: "absolute", top: -10, right: -10, bgcolor: "error.main", color: "white", "&:hover": { bgcolor: "error.dark" } }}
                                    >
                                        <CancelIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
                                <Box>
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
                                            startIcon={uploading ? <CircularProgress size={20} /> : <PhotoCamera />}
                                            disabled={uploading}
                                            sx={{ borderRadius: "20px", textTransform: "none" }}
                                        >
                                            {uploading ? "Uploading..." : "Add Image"}
                                        </Button>
                                    </label>
                                </Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={submitting || uploading || !title.trim() || !content.trim() || content === "<p><br></p>"}
                                    startIcon={submitting ? <CircularProgress size={20} /> : (editingPostId ? <CreateIcon /> : <CreateIcon />)}
                                    sx={{ borderRadius: "20px", px: 4, fontWeight: 700, textTransform: "none" }}
                                >
                                    {editingPostId ? "Update Story" : "Publish"}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>

                {/* Feed */}
                <Stack spacing={4}>
                    {posts.map((post, index) => (
                        <Grow in key={post._id} timeout={500 + index * 100}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    transition: "all 0.3s ease",
                                    "&:hover": { borderColor: "primary.light", transform: "translateY(-4px)" }
                                }}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar sx={{ bgcolor: "secondary.main", fontWeight: 700 }}>
                                            {post.author.name?.[0].toUpperCase() || post.author.email[0].toUpperCase()}
                                        </Avatar>
                                    }
                                    title={<Typography sx={{ fontWeight: 800 }}>{post.author.name || post.author.email.split("@")[0]}</Typography>}
                                    subheader={
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <TimeIcon sx={{ fontSize: "0.85rem", color: "text.disabled" }} />
                                            <Typography variant="caption" color="text.disabled">
                                                {formatDistanceToNow(new Date(post.createdAt))} ago
                                            </Typography>
                                        </Stack>
                                    }
                                    action={
                                        post.author._id === user?._id && (
                                            <Stack direction="row">
                                                <IconButton size="small" onClick={() => handleEditInitiate(post)} sx={{ color: "primary.main" }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDelete(post._id)} sx={{ color: "error.main" }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        )
                                    }
                                />
                                <CardContent sx={{ pt: 0 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.3 }}>
                                        {post.title}
                                    </Typography>

                                    {post.imageUrl && (
                                        <Box sx={{ mb: 2, borderRadius: 1, overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
                                            <img src={post.imageUrl} alt={post.title} style={{ width: "100%", height: "400px", display: "block" }} />
                                        </Box>
                                    )}

                                    <Box
                                        sx={{
                                            mb: 3,
                                            "& p": { mb: 2, lineHeight: 1.6, fontSize: "1.05rem" },
                                            "& h1, h2, h3": { mb: 2, fontWeight: 800 },
                                            "& code": { bgcolor: "action.hover", p: 0.5, borderRadius: 1, fontFamily: "monospace" },
                                            "& pre": { bgcolor: "action.hover", p: 2, borderRadius: 2, overflowX: "auto", mb: 2 },
                                            "& img": { maxWidth: "100%", borderRadius: 1 },
                                            "& blockquote": { borderLeft: "4px solid", borderColor: "primary.main", pl: 2, ml: 0, fontStyle: "italic", mb: 2 },
                                            "& ul, ol": { pl: 3, mb: 2 }
                                        }}
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />

                                    <Divider sx={{ mb: 2, opacity: 0.5 }} />

                                    <Stack direction="row" spacing={3}>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <IconButton onClick={() => handleLike(post._id)} sx={{ color: post.likes.includes(user?._id || "") ? "error.main" : "inherit" }}>
                                                {post.likes.includes(user?._id || "") ? <LikeIcon /> : <LikeBorderIcon />}
                                            </IconButton>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{post.likes.length}</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <IconButton onClick={() => toggleComments(post._id)}>
                                                <CommentIcon />
                                            </IconButton>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{post.comments.length}</Typography>
                                        </Stack>
                                    </Stack>

                                    {/* Comments Section */}
                                    <Collapse in={expandedComments[post._id]}>
                                        <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed", borderColor: "divider" }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Comments ({post.comments.length})
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    startIcon={<CommentIcon />}
                                                    onClick={() => openCommentModal(post._id)}
                                                    variant="outlined"
                                                    sx={{ borderRadius: "20px" }}
                                                >
                                                    Add Comment
                                                </Button>
                                            </Box>

                                            <Grid container spacing={2}>
                                                {post.comments.map(comment => (
                                                    <Grid item xs={12} md={6} key={comment._id}>
                                                        <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 3, height: "100%" }}>
                                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                                                <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem", bgcolor: "secondary.main" }}>
                                                                    {comment.user?.name?.[0]?.toUpperCase() || "?"}
                                                                </Avatar>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                                    {comment.user?.name || "Anonymous"}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.disabled">
                                                                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                                                                </Typography>
                                                            </Stack>
                                                            <Box
                                                                sx={{
                                                                    "& p": { m: 0 },
                                                                    "& strong": { fontWeight: 700 },
                                                                    "& em": { fontStyle: "italic" }
                                                                }}
                                                                dangerouslySetInnerHTML={{ __html: comment.text }}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Collapse>
                                </CardContent>
                            </Card>
                        </Grow>
                    ))}
                </Stack>

                {/* Comment Modal */}
                <Dialog
                    open={commentModalOpen}
                    onClose={handleCloseCommentModal}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle sx={{ fontWeight: 800 }}>Write a response</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 1, "& .ql-container": { minHeight: "150px", fontSize: "1rem" } }}>
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
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleCloseCommentModal} color="inherit">Cancel</Button>
                        <Button
                            onClick={handleComment}
                            variant="contained"
                            disabled={!commentText.trim() || commentText === "<p><br></p>"}
                            sx={{ borderRadius: "20px", fontWeight: 700 }}
                        >
                            Respond
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Fade>
    );
};

export default Feed;
