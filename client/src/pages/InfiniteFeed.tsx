import { useState, useEffect, useRef, useCallback } from "react";
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Stack,
    IconButtonProps,
    styled,
    useTheme,
    Button
} from "@mui/material";
import {
    Favorite as LikeIcon,
    FavoriteBorder as LikeBorderIcon,
    ChatBubbleOutline as CommentIcon,
    Share as ShareIcon,
    BookmarkBorder as SaveIcon,
    Bookmark as SavedIcon,
    KeyboardArrowDown
} from "@mui/icons-material";
import api from "../api/axios";
import { followUser, unfollowUser } from "../services/socialService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";
import SharePostModal from "../components/feed/SharePostModal";
import CommentModal from "../components/feed/CommentModal";
import { formatDistanceToNow } from "date-fns";

const ReelContainer = styled(Box)(({ theme }) => ({
    height: 'calc(100vh - 80px)', // Subtract Topbar height if necessary or use 100vh manually
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
    position: 'relative',
    backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#f0f2f5'
}));

const ReelItem = styled(Box)(() => ({
    height: 'calc(100vh - 80px)',
    width: '100%',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
}));

const ActionButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.2)',
    backdropFilter: 'blur(8px)',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    padding: theme.spacing(1.5)
}));

const ReelContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(3),
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    color: '#fff',
    zIndex: 2
}));

const InfiniteFeed = () => {
    const { user, checkAuth } = useAuth();
    const { showToast } = useToast();
    const theme = useTheme();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [activePost, setActivePost] = useState<any>(null);
    const [commentText, setCommentText] = useState("");

    const fetchPosts = useCallback(async (pageNum: number) => {
        try {
            const { data } = await api.get(`/posts?page=${pageNum}&limit=10&random=true`);
            if (data.length === 0) {
                setHasMore(false);
                return;
            }
            setPosts(prev => {
                const newPosts = data.filter((p: any) => !prev.some(existing => existing._id === p._id));
                return [...prev, ...newPosts];
            });
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // If we are near the bottom, load more
        if (scrollHeight - scrollTop <= clientHeight * 2 && hasMore && !loading) {
            setPage(prev => {
                const next = prev + 1;
                fetchPosts(next);
                return next;
            });
        }
    };

    const handleLike = async (post: any) => {
        const targetId = post.originalId || post._id;
        try {
            const { data } = await api.post(`/posts/${targetId}/like`);
            setPosts(prev => prev.map(p => (p.originalId === targetId || p._id === targetId) ? { ...p, likes: data.likes } : p));
        } catch (error) {
            showToast("Failed to like post", "error");
        }
    };

    const handleSave = async (post: any) => {
        const targetId = post.originalId || post._id;
        try {
            const { data } = await api.post(`/posts/${targetId}/save`);
            setPosts(prev => prev.map(p => (p.originalId === targetId || p._id === targetId) ? { ...p, savedBy: data.savedBy } : p));
            showToast(data.savedBy.includes(user?._id) ? "Post saved" : "Post removed", "success");
        } catch (error) {
            showToast("Failed to save post", "error");
        }
    };

    const handleFollow = async (userId: string) => {
        try {
            if (user?.following?.includes(userId)) {
                await unfollowUser(userId);
                showToast("Unfollowed successfully", "success");
            } else {
                await followUser(userId);
                showToast("Followed successfully", "success");
            }
            // Update local user state
            checkAuth?.();
        } catch (error) {
            showToast("Failed to update follow status", "error");
        }
    };

    const handleComment = async () => {
        if (!activePost || !commentText.trim()) return;
        const targetId = activePost.originalId || activePost._id;
        try {
            const { data } = await api.post(`/posts/${targetId}/comment`, { text: commentText });
            setPosts(prev => prev.map(p => (p.originalId === targetId || p._id === targetId) ? { ...p, comments: data.comments } : p));
            setCommentText("");
            setCommentModalOpen(false);
            showToast("Comment added", "success");
        } catch (error) {
            showToast("Failed to add comment", "error");
        }
    };

    const openCommentModal = (post: any) => {
        setActivePost(post);
        setCommentText("");
        setCommentModalOpen(true);
    };

    if (loading && posts.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Loader />
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
            <ReelContainer ref={containerRef} onScroll={handleScroll}>
                {posts.map((post) => (
                    <ReelItem key={post._id}>
                        {/* Background / Image */}
                        {post.imageUrl ? (
                            <Box
                                component="img"
                                src={post.imageUrl}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    zIndex: 0
                                }}
                            />
                        ) : (
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                                position: 'absolute',
                                zIndex: 0
                            }} />
                        )}

                        {/* Overlay Actions */}
                        <Stack
                            spacing={2}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                bottom: 100,
                                zIndex: 3,
                                alignItems: 'center'
                            }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <ActionButton onClick={() => handleLike(post)}>
                                    {post.likes.includes(user?._id) ? <LikeIcon sx={{ color: '#ff1744' }} /> : <LikeBorderIcon />}
                                </ActionButton>
                                <Typography variant="caption" sx={{ color: '#fff', mt: 0.5, display: 'block', fontWeight: 700 }}>
                                    {post.likes.length}
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <ActionButton onClick={() => openCommentModal(post)}>
                                    <CommentIcon />
                                </ActionButton>
                                <Typography variant="caption" sx={{ color: '#fff', mt: 0.5, display: 'block', fontWeight: 700 }}>
                                    {post.comments.length}
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <ActionButton onClick={() => { setActivePost(post); setShareModalOpen(true); }}>
                                    <ShareIcon />
                                </ActionButton>
                                <Typography variant="caption" sx={{ color: '#fff', mt: 0.5, display: 'block', fontWeight: 700 }}>
                                    Share
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <ActionButton onClick={() => handleSave(post)}>
                                    {post.savedBy?.includes(user?._id) ? <SavedIcon color="primary" /> : <SaveIcon />}
                                </ActionButton>
                            </Box>
                        </Stack>

                        {/* Content Info */}
                        <ReelContent>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Avatar
                                    src={post.author?.avatar}
                                    sx={{ width: 48, height: 48, border: '2px solid white' }}
                                >
                                    {post.author?.name?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                        {post.author?.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        {formatDistanceToNow(new Date(post.createdAt))} ago
                                    </Typography>
                                </Box>
                                {user?._id !== post.author?._id && (
                                    <Button
                                        variant={user?.following?.includes(post.author?._id) ? "outlined" : "contained"}
                                        size="small"
                                        onClick={() => handleFollow(post.author?._id)}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            borderRadius: '20px',
                                            ml: 'auto',
                                            '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.main' }
                                        }}
                                    >
                                        {user?.following?.includes(post.author?._id) ? "Following" : "Follow"}
                                    </Button>
                                )}
                            </Stack>

                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                                {post.title}
                            </Typography>
                            <Box
                                sx={{
                                    maxHeight: '100px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    opacity: 0.9,
                                    fontSize: '0.95rem'
                                }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {post.tags?.length > 0 && (
                                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                    {post.tags.slice(0, 3).map((tag: string) => (
                                        <Typography key={tag} variant="caption" sx={{ fontWeight: 700, bgcolor: 'rgba(255,255,255,0.2)', px: 1, py: 0.5, borderRadius: 1 }}>
                                            #{tag}
                                        </Typography>
                                    ))}
                                </Stack>
                            )}
                        </ReelContent>

                        {/* Scroll Indicator */}
                        <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 2, opacity: 0.5 }}>
                            <KeyboardArrowDown sx={{ fontSize: 40, color: 'white' }} className="animate-bounce" />
                        </Box>
                    </ReelItem>
                ))}
            </ReelContainer>

            {activePost && (
                <>
                    <SharePostModal
                        open={shareModalOpen}
                        onClose={() => setShareModalOpen(false)}
                        postId={activePost.originalId || activePost._id}
                        postTitle={activePost.title}
                    />
                    <CommentModal
                        open={commentModalOpen}
                        onClose={() => setCommentModalOpen(false)}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        handleComment={handleComment}
                    />
                </>
            )}

            <style>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0) translateX(-50%);}
                    40% {transform: translateY(-10px) translateX(-50%);}
                    60% {transform: translateY(-5px) translateX(-50%);}
                }
                .animate-bounce {
                    animation: bounce 2s infinite;
                }
            `}</style>
        </Box>
    );
};

export default InfiniteFeed;
