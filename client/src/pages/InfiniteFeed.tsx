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
    Button,
    alpha
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

const ReelContainer = styled(Box)(() => ({
    height: 'calc(100vh - 80px)',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
    position: 'relative',
    backgroundColor: '#000', // Reels usually look best in deep black
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
    overflow: 'hidden',
    backgroundColor: '#000',
}));

const ActionButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    color: '#fff',
    backgroundColor: alpha('#000', 0.3),
    backdropFilter: 'blur(12px)',
    border: `1px solid ${alpha('#fff', 0.1)}`,
    '&:hover': {
        backgroundColor: alpha('#fff', 0.1),
        transform: 'scale(1.1)',
    },
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: theme.spacing(1.8),
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
}));

const ReelContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(6),
    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
    color: '#fff',
    zIndex: 2,
    pointerEvents: 'none',
    '& > *': {
        pointerEvents: 'auto'
    }
}));

const ProgressIndicator = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.1s linear',
    zIndex: 10,
    boxShadow: `0 0 10px ${theme.palette.primary.main}`,
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
    const [lastTap, setLastTap] = useState(0);
    const [showLikeHeart, setShowLikeHeart] = useState<{ id: string | null, active: boolean }>({ id: null, active: false });
    const [scrollProgress, setScrollProgress] = useState(0);

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

        // Update scroll progress
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(progress);

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

    const handleDoubleTap = (post: any) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (now - lastTap < DOUBLE_PRESS_DELAY) {
            if (!post.likes.includes(user?._id)) {
                handleLike(post);
            }
            setShowLikeHeart({ id: post._id, active: true });
            setTimeout(() => setShowLikeHeart({ id: null, active: false }), 1000);
        }
        setLastTap(now);
    };

    if (loading && posts.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', bgcolor: '#000' }}>
                <Loader />
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
            <ProgressIndicator sx={{ width: `${scrollProgress}%` }} />
            <ReelContainer ref={containerRef} onScroll={handleScroll}>
                {posts.map((post) => (
                    <ReelItem key={post._id} onClick={() => handleDoubleTap(post)}>
                        {/* Background / Image or Video */}
                        {post.imageUrl ? (
                            post.mediaType === 'video' ? (
                                <Box
                                    component="video"
                                    src={post.imageUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain', // Changed to contain for better video experience if aspect ratio differs
                                        position: 'absolute',
                                        zIndex: 0,
                                        bgcolor: '#000'
                                    }}
                                />
                            ) : (
                                <Box
                                    component="img"
                                    src={post.imageUrl}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        position: 'absolute',
                                        zIndex: 0,
                                        bgcolor: '#000'
                                    }}
                                />
                            )
                        ) : (
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                                position: 'absolute',
                                zIndex: 0
                            }} />
                        )}

                        {/* Double Tap Heart Animation */}
                        {showLikeHeart.id === post._id && showLikeHeart.active && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 5,
                                    animation: 'popAndFade 0.8s ease-out forwards',
                                    pointerEvents: 'none'
                                }}
                            >
                                <LikeIcon sx={{ fontSize: 100, color: alpha('#ff1744', 0.9) }} />
                            </Box>
                        )}

                        {/* Overlay Actions */}
                        <Stack
                            spacing={3}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                bottom: 120,
                                zIndex: 3,
                                alignItems: 'center'
                            }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <ActionButton onClick={(e) => { e.stopPropagation(); handleLike(post); }} sx={{ transform: post.likes.includes(user?._id) ? 'scale(1.1)' : 'none' }}>
                                    {post.likes.includes(user?._id) ? <LikeIcon sx={{ color: '#ff1744' }} /> : <LikeBorderIcon />}
                                </ActionButton>
                                <Typography variant="caption" sx={{ color: '#fff', mt: 1, display: 'block', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    {post.likes.length}
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <ActionButton onClick={(e) => { e.stopPropagation(); openCommentModal(post); }}>
                                    <CommentIcon />
                                </ActionButton>
                                <Typography variant="caption" sx={{ color: '#fff', mt: 1, display: 'block', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    {post.comments.length}
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <ActionButton onClick={(e) => { e.stopPropagation(); setActivePost(post); setShareModalOpen(true); }}>
                                    <ShareIcon />
                                </ActionButton>
                                <Typography variant="caption" sx={{ color: '#fff', mt: 1, display: 'block', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    Share
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <ActionButton onClick={(e) => { e.stopPropagation(); handleSave(post); }}>
                                    {post.savedBy?.includes(user?._id) ? <SavedIcon sx={{ color: theme.palette.secondary.main }} /> : <SaveIcon />}
                                </ActionButton>
                            </Box>
                        </Stack>

                        {/* Content Info */}
                        <ReelContent>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={post.author?.avatar}
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            border: `2px solid ${theme.palette.primary.main}`,
                                            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
                                        }}
                                    >
                                        {post.author?.name?.[0]}
                                    </Avatar>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.02em', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                        {post.author?.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                        {formatDistanceToNow(new Date(post.createdAt))} ago
                                    </Typography>
                                </Box>
                                {user?._id !== post.author?._id && (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={(e) => { e.stopPropagation(); handleFollow(post.author?._id); }}
                                        sx={{
                                            background: user?.following?.includes(post.author?._id)
                                                ? alpha('#fff', 0.1)
                                                : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            backdropFilter: 'blur(8px)',
                                            color: '#white',
                                            borderRadius: '24px',
                                            px: 2.5,
                                            fontWeight: 700,
                                            ml: 2,
                                            border: user?.following?.includes(post.author?._id) ? '1px solid rgba(255,255,255,0.3)' : 'none',
                                            '&:hover': {
                                                opacity: 0.9,
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                            }
                                        }}
                                    >
                                        {user?.following?.includes(post.author?._id) ? "Following" : "Follow"}
                                    </Button>
                                )}
                            </Stack>

                            <Typography variant="h4" component="h2" sx={{ fontWeight: 900, mb: 1.5, fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                                {post.title}
                            </Typography>

                            <Box
                                sx={{
                                    maxHeight: '80px',
                                    overflow: 'hidden',
                                    opacity: 0.9,
                                    fontSize: '1rem',
                                    lineHeight: 1.5,
                                    mb: 2,
                                    '& p': { m: 0 }
                                }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {post.tags?.length > 0 && (
                                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                    {post.tags.slice(0, 4).map((tag: string) => (
                                        <Box
                                            key={tag}
                                            sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                backdropFilter: 'blur(4px)',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: '6px',
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.primary.light }}>
                                                #{tag}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </ReelContent>

                        {/* Scroll Indicator */}
                        <Box sx={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 2, opacity: 0.6 }}>
                            <KeyboardArrowDown sx={{ fontSize: 40, color: '#fff' }} className="animate-bounce" />
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
                @keyframes popAndFade {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                }
            `}</style>
        </Box>
    );
};

export default InfiniteFeed;
