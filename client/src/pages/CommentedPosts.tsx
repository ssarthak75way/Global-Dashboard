import { useState, useEffect } from "react";
import { Container, Typography, Grid, Box, CircularProgress, Button, Breadcrumbs, Link as MuiLink, Paper } from "@mui/material";
import { getCommentedPosts, deleteComment as deleteCommentService } from "../services/socialService";
import PostItem from "../components/feed/PostItem";
import { Comment as CommentIcon, NavigateNext } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        name: string;
        avatar: string;
        email: string;
    };
    imageUrl?: string;
    likes: string[];
    comments: any[];
    ratings: { user: string; score: number }[];
    createdAt: string;
}

const CommentedPosts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedComments, setExpandedComments] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getCommentedPosts();
                setPosts(response.data);
            } catch (error) {
                console.error("Failed to fetch commented posts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleLike = async (postId: string) => {
        try {
            await api.post(`/posts/${postId}/like`);
            setPosts(prev => prev.map(p => {
                if (p._id === postId) {
                    const liked = p.likes.includes(user?._id || "");
                    return {
                        ...p,
                        likes: liked
                            ? p.likes.filter((id: string) => id !== (user?._id || ""))
                            : [...p.likes, (user?._id || "")]
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error("Like failed", error);
        }
    };

    const handleDeleteComment = async (postId: string, commentId: string) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            const { data } = await deleteCommentService(postId, commentId);
            setPosts(prev => prev.map(p => p._id === postId ? data : p));
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };

    const handleRate = async (postId: string, score: number) => {
        try {
            const { data } = await api.post(`/posts/${postId}/rate`, { score });
            setPosts(prev => prev.map(p => p._id === postId ? data : p));
        } catch (error) {
            console.error("Failed to rate post", error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
                <MuiLink component={Link} to="/settings" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', textDecoration: 'none' }}>
                    Settings
                </MuiLink>
                <Typography color="text.primary" sx={{ fontWeight: 700 }}>Commented Posts</Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: 'primary.light',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <CommentIcon />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>My Comments</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {posts.length} {posts.length === 1 ? 'post' : 'posts'} you've shared thoughts on
                        </Typography>
                    </Box>
                </Box>
                <Button variant="outlined" size="small" onClick={() => navigate("/feed")}>
                    Browse Feed
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : posts.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: 'action.hover' }}>
                    <CommentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>No comments yet</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Join the conversations on the feed!</Typography>
                    <Button variant="contained" onClick={() => navigate("/feed")}>Explore Feed</Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {posts.map((post, index) => (
                        <Grid item xs={12} key={post._id}>
                            <PostItem
                                post={post}
                                index={index}
                                user={user}
                                handleLike={handleLike}
                                toggleComments={(id) => setExpandedComments(prev =>
                                    prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
                                )}
                                isCommentsExpanded={expandedComments.includes(post._id)}
                                handleDeleteComment={handleDeleteComment}
                                handleRate={handleRate}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default CommentedPosts;
