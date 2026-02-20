import { useState, useEffect, useRef, useCallback } from "react";
import {
    Box,
    Stack,
    Fade,
    TextField,
    InputAdornment,
    Typography
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/Loader";

// Modular Components
import FeedHeader from "../components/feed/FeedHeader";
import CreatePost from "../components/feed/CreatePost";
import PostItem from "../components/feed/PostItem";
import CommentModal from "../components/feed/CommentModal";
import { deleteComment as deleteCommentService } from "../services/socialService";
import { useToast } from "../context/ToastContext";

interface Comment {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar: string;
    };
    text: string;
    createdAt: string;
}

interface Post {
    _id: string;
    originalId?: string;
    isRandom?: boolean;
    title: string;
    content: string;
    author: {
        _id: string;
        name: string;
        avatar: string;
        email: string;
    };
    imageUrl?: string;
    mediaType?: 'image' | 'video';
    likes: string[];
    savedBy: string[];
    comments: Comment[];
    ratings: { user: string; score: number }[];
    createdAt: string;
}

const Feed = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const [isExpanded, setIsExpanded] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

    // Comment Modal State
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { showToast } = useToast();

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(page);
            fetchPosts(page, true);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Observer for infinite scroll
    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostElementRef = useCallback((node: HTMLDivElement) => {
        if (loading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    fetchPosts(nextPage, false);
                    return nextPage;
                });
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, isFetchingMore, hasMore]);

    const fetchPosts = async (pageNum: number, isNewSearch: boolean) => {
        try {
            if (isNewSearch) {
                setLoading(true);
            } else {
                setIsFetchingMore(true);
            }

            const { data } = await api.get(`/posts?page=${pageNum}&limit=10${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);


            if (isNewSearch) {
                setPosts(data);
                // If we get fewer than limit on first page, no more.
                setHasMore(searchQuery ? data.length === 10 : data.length > 0);
            } else {
                setPosts(prev => {
                    // Filter out duplicates ONLY if they fall within the non-random range or have same ID.
                    // But now backend sends unique IDs for random posts, so we can just trust the IDs.
                    // However, we still might get "real" duplicates if pagination overlaps, so we check ID.
                    const newPosts = data.filter((p: Post) => !prev.some(existing => existing._id === p._id));
                    return [...prev, ...newPosts];
                });
                // Infinite loop active: backend returns data even after end.
                // Only stop if data is empty (which shouldn't happen with random loop unless DB empty)
                if (data.length === 0) setHasMore(false); else setHasMore(true);
            }

        } catch (error) {
            console.error("Failed to fetch posts", error);
            showToast("Failed to load feed", "error");
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    // Initial fetch handled by search effect
    // useEffect(() => {
    //     fetchPosts();
    // }, []);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setSubmitting(true);
        try {
            if (editingPostId) {
                const { data } = await api.put(`/posts/${editingPostId}`, { title, content, imageUrl, tags, mediaType });
                setPosts(posts.map(p => p._id === editingPostId ? data : p));
                showToast("Post updated successfully", "success");
            } else {
                const { data } = await api.post("/posts", { title, content, imageUrl, tags, mediaType });
                setPosts([data, ...posts]);
                showToast("Post created successfully", "success");
            }
            resetForm();
        } catch (error) {
            console.error("Failed to save post", error);
            showToast("Failed to save post", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setImageUrl(null);
        setMediaType('image');
        setIsExpanded(false);
        setEditingPostId(null);
    };

    const handleEditInitiate = (post: any) => {
        setTitle(post.title);
        setContent(post.content);
        setImageUrl(post.imageUrl || null);
        setMediaType(post.mediaType || 'image');
        // Use original ID for editing to ensure we update the real record
        setEditingPostId(post.originalId || post._id);
        setIsExpanded(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (postId: string) => {
        const post = posts.find(p => p._id === postId);
        if (!post) return;

        const targetId = post.originalId || post._id;

        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/posts/${targetId}`);
            // Remove all instances of this post (original and random ghosts)
            setPosts(posts.filter(p => p._id !== postId && p.originalId !== targetId && p._id !== targetId));
            showToast("Post deleted successfully", "success");
        } catch (error) {
            console.error("Failed to delete post", error);
            showToast("Failed to delete post", "error");
        }
    };

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("image", file); // Keep key as "image" for backward compat if backend expects it

        try {
            const { data } = await api.post("/posts/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setImageUrl(data.imageUrl);
            setMediaType(data.mediaType || 'image');
            showToast("Media uploaded successfully", "success");
        } catch (error) {
            console.error("Media upload failed", error);
            showToast("Media upload failed", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleLike = async (postId: string) => {
        const post = posts.find(p => p._id === postId);
        if (!post) return;

        const targetId = post.originalId || post._id;

        try {
            const { data } = await api.post(`/posts/${targetId}/like`);
            // Update the specific post item in the list
            setPosts(posts.map(p => {
                if (p._id === postId) {
                    // Update this specific instance
                    return { ...p, likes: data.likes };
                }
                if (p.originalId === targetId || p._id === targetId) {
                    // Start thinking about syncing other instances?
                    // For now, let's just update the clicked one to keep it simple and responsive
                    // Or update all instances to show consistency?
                    // Let's update all instances of the same post
                    return { ...p, likes: data.likes };
                }
                return p;
            }));
        } catch (error) {
            console.error("Failed to like post", error);
            showToast("Failed to like post", "error");
        }
    };

    const handleSave = async (postId: string) => {
        const post = posts.find(p => p._id === postId);
        if (!post) return;

        const targetId = post.originalId || post._id;

        try {
            const { data } = await api.post(`/posts/${targetId}/save`);
            // Update all instances of this post
            setPosts(posts.map(p => {
                if (p._id === postId || p.originalId === targetId || p._id === targetId) {
                    return { ...p, savedBy: data.savedBy };
                }
                return p;
            }));
            const isSaved = data.savedBy.includes(user?._id || "");
            showToast(isSaved ? "Post saved to your collection" : "Post removed from compiled", "success");
        } catch (error) {
            console.error("Failed to save post", error);
            showToast("Failed to save post", "error");
        }
    };

    const handleComment = async () => {
        if (!activeCommentPostId || !commentText.trim() || commentText === "<p><br></p>") return;

        const post = posts.find(p => p._id === activeCommentPostId);
        if (!post) return;

        const targetId = post.originalId || post._id;

        try {
            const { data } = await api.post(`/posts/${targetId}/comment`, { text: commentText });
            // Update all instances of this post
            setPosts(posts.map(p => {
                if (p._id === activeCommentPostId || p.originalId === targetId || p._id === targetId) {
                    return { ...p, comments: data.comments };
                }
                return p;
            }));
            handleCloseCommentModal();
            showToast("Comment added successfully", "success");
        } catch (error) {
            console.error("Failed to add comment", error);
            showToast("Failed to add comment", "error");
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

    const handleDeleteComment = async (postId: string, commentId: string) => {
        const post = posts.find(p => p._id === postId);
        if (!post) return;

        const targetId = post.originalId || post._id;

        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            const { data } = await deleteCommentService(targetId, commentId);
            // Update all instances
            setPosts(posts.map(p => {
                if (p._id === postId || p.originalId === targetId || p._id === targetId) {
                    return { ...p, comments: data.comments };
                }
                return p;
            }));
            showToast("Comment deleted", "success");
        } catch (error) {
            console.error("Failed to delete comment", error);
            showToast("Failed to delete comment", "error");
        }
    };

    const handleRate = async (postId: string, score: number) => {
        const post = posts.find(p => p._id === postId);
        if (!post) return;

        const targetId = post.originalId || post._id;

        try {
            const { data } = await api.post(`/posts/${targetId}/rate`, { score });
            // Update all instances
            setPosts(posts.map(p => {
                if (p._id === postId || p.originalId === targetId || p._id === targetId) {
                    return { ...p, ratings: data.ratings };
                }
                return p;
            }));
            showToast("Rating submitted", "success");
        } catch (error) {
            console.error("Failed to rate post", error);
            showToast("Failed to rate post", "error");
        }
    };

    const styles = {
        loadingContainer: { display: "flex", justifyContent: "center", mt: 8 },
        mainContainer: { maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3 }, py:8, minHeight: "100vh" }
    };

    return (
        <Fade in timeout={800}>
            <Box sx={styles.mainContainer}>
                <FeedHeader />

                {/* Search Input */}
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        placeholder="Search posts, #tags, or @users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '30px',
                                bgcolor: 'background.paper',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'divider'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main'
                                }
                            }
                        }}
                    />
                </Box>

                <CreatePost
                    user={user}
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    tags={tags}
                    setTags={setTags}
                    handleCreatePost={handleCreatePost}
                    submitting={submitting}
                    uploading={uploading}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    editingPostId={editingPostId}
                    resetForm={resetForm}
                    handleImageUpload={handleMediaUpload}
                    mediaType={mediaType}
                />

                {loading ? (
                    <Box sx={styles.loadingContainer}>
                        <Loader />
                    </Box>
                ) : (
                    <Stack spacing={4}>
                        {posts.map((post, index) => (
                            <PostItem
                                key={`${post._id}-${index}`}
                                post={post}
                                index={index}
                                user={user}
                                handleEditInitiate={handleEditInitiate}
                                handleDelete={handleDelete}
                                handleLike={handleLike}
                                toggleComments={toggleComments}
                                isCommentsExpanded={!!expandedComments[post._id]}
                                openCommentModal={openCommentModal}
                                handleDeleteComment={handleDeleteComment}
                                handleRate={handleRate}
                                handleSave={handleSave}
                            />
                        ))}
                        {/* Sentinel for infinite scroll */}
                        <div ref={lastPostElementRef} style={{ height: '10px', background: 'transparent' }} />
                        {isFetchingMore && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                <Loader />
                            </Box>
                        )}
                        {posts.length === 0 && !loading && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No posts found matching "{searchQuery}"
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                )}

                <CommentModal
                    open={commentModalOpen}
                    onClose={handleCloseCommentModal}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    handleComment={handleComment}
                />
            </Box>
        </Fade>
    );
};

export default Feed;