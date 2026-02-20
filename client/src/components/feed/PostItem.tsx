import {
    Typography,
    Avatar,
    Stack,
    Box,
    Tooltip,
    Chip,
    CardContent,
    IconButton,
    Grow,
    Card,
    Collapse,
    CardHeader,
    alpha,
    Rating,
    Grid
} from "@mui/material";
import {
    Favorite as LikeIcon,
    FavoriteBorder as LikeBorderIcon,
    ChatBubbleOutline as CommentIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    BookmarkBorder as SaveIcon,
    Bookmark as SavedIcon,
    Share as ShareIcon
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import SharePostModal from "./SharePostModal";

// Reusing interfaces from feed for consistency, in a real app these go in a types file
interface Comment {
    _id: string;
    user: {
        _id: string;
        avatar: string;
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
        avatar: string;
        email: string;
    };
    imageUrl?: string;
    mediaType?: 'image' | 'video';
    tags?: string[];
    likes: string[];
    savedBy: string[];
    comments: Comment[];
    ratings: { user: string; score: number }[];
    createdAt: string;
}

interface PostItemProps {
    post: Post;
    index: number;
    user: { _id: string; name?: string; avatar?: string; } | null;
    handleEditInitiate?: (post: Post) => void;
    handleDelete?: (postId: string) => void;
    handleLike?: (postId: string) => void;
    toggleComments?: (postId: string) => void;
    isCommentsExpanded?: boolean;
    openCommentModal?: (postId: string) => void;
    handleDeleteComment?: (postId: string, commentId: string) => void;
    handleRate?: (postId: string, score: number) => void;
    handleSave?: (postId: string) => void;
}

const PostItem = ({
    post,
    index,
    user,
    handleEditInitiate,
    handleDelete,
    handleLike,
    toggleComments,
    isCommentsExpanded,
    openCommentModal,
    handleDeleteComment,
    handleRate,
    handleSave
}: PostItemProps) => {
    // Calculate average rating
    const averageRating = post.ratings && post.ratings.length > 0
        ? post.ratings.reduce((acc, curr) => acc + curr.score, 0) / post.ratings.length
        : 0;

    const userRating = post.ratings?.find(r => r.user === user?._id)?.score || 0;

    const styles = {
        postCard: {
            maxWidth: '100%',
            borderRadius: 1,
            border: "1px solid",
            borderColor: (theme: any) => theme.palette.mode === 'light'
                ? alpha(theme.palette.divider, 0.4)
                : alpha(theme.palette.divider, 0.1),
            background: (theme: any) => theme.palette.mode === 'light'
                ? alpha('#fff', 0.8)
                : alpha(theme.palette.background.paper, 0.4),
            backdropFilter: "blur(12px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
                borderColor: "primary.main",
                transform: "translateY(-4px)",
                boxShadow: (theme: any) => `0 12px 30px ${alpha(theme.palette.primary.main, 0.08)}`,
            }
        },
        postCardHeader: {
            px: { xs: 2, sm: 3 },
            pt: 2.5,
            pb: 2,
            "& .MuiCardHeader-avatar": {
                marginRight: 1.5
            }
        },
        postCardHeaderAvatar: {
            width: 42,
            height: 42,
            border: '1.5px solid',
            borderColor: 'primary.main',
            p: 0.2,
            bgcolor: 'background.paper'
        },
        postCardHeaderTitle: {
            fontWeight: 800,
            fontSize: '1rem',
            color: 'text.primary'
        },
        postContent: {
            pt: 0,
            px: { xs: 2.5, sm: 3.5 },
            pb: "24px !important"
        },
        postTitle: {
            fontWeight: 900,
            mb: 1.5,
            lineHeight: 1.25,
            fontSize: { xs: '1.4rem', sm: '1.8rem' },
            color: 'text.primary',
            letterSpacing: '-0.01em'
        },
        postImageContainer: {
            position: 'relative',
            mb: 3,
            mt: 0.5,
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "#000",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            maxHeight: 550
        },
        mediaTag: {
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            bgcolor: alpha('#000', 0.5),
            backdropFilter: 'blur(8px)',
            color: 'white',
            fontWeight: 800,
            px: 1.2,
            py: 0.4,
            borderRadius: 1.5,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        },
        postHtmlContent: {
            width: '100%',
            overflow: 'hidden',
            wordBreak: 'break-word',
            mb: 3.5,
            color: "text.primary",
            lineHeight: 1.7,
            letterSpacing: '0.01em',
            "& p": {
                mb: 2,
                fontSize: { xs: "1rem", sm: "1.08rem" },
                '&:last-child': { mb: 0 }
            },
            "& h1, h2, h3": {
                mb: 2,
                fontWeight: 800,
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                mt: 3,
                color: 'text.primary',
                lineHeight: 1.3
            },
            "& blockquote": {
                borderLeft: "4px solid",
                borderColor: "primary.main",
                bgcolor: (theme: any) => alpha(theme.palette.primary.main, 0.04),
                p: 2.5,
                pl: 3.5,
                borderRadius: '4px 12px 12px 4px',
                fontStyle: "italic",
                my: 3.5,
                mx: 0,
                boxShadow: (theme: any) => `inset 10px 0 20px -10px ${alpha(theme.palette.primary.main, 0.1)}`
            },
            "& ul, & ol": {
                pl: 3,
                mb: 2,
                '& li': { mb: 1 }
            },
            "& img": {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                my: 2
            }
        },
        interactionRow: {
            pt: 2.5,
            borderTop: "1px solid",
            borderColor: (theme: any) => alpha(theme.palette.divider, 0.5),
            mt: 1.5
        },
        actionButton: {
            borderRadius: 2.5,
            px: 1.8,
            py: 0.8,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            '&:hover': {
                bgcolor: (theme: any) => alpha(theme.palette.primary.main, 0.08),
                color: 'primary.main',
                '& .MuiSvgIcon-root': { transform: 'scale(1.1)' }
            }
        },
        saveButton: {
            bgcolor: (theme: any) => alpha(theme.palette.action.hover, 0.6),
            borderRadius: 2,
            p: 1,
            '&:hover': { bgcolor: (theme: any) => alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }
        },
        saveButtonActive: {
            bgcolor: (theme: any) => alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            borderRadius: 2,
            p: 1,
            '&:hover': { bgcolor: (theme: any) => alpha(theme.palette.primary.main, 0.15) }
        },
        commentsSection: {
            mt: 2,
            pt: 2.5,
            borderTop: "1px dashed",
            borderColor: "divider"
        },
        commentsHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
            cursor: 'pointer',
            '&:hover': {
                '& .MuiTypography-subtitle2': { color: 'primary.main' }
            }
        },
        commentTrigger: {
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            m: 4,
            bgcolor: (theme: any) => alpha(theme.palette.action.hover, 0.5),
            borderRadius: 1,
            cursor: 'pointer',
            border: '1px solid transparent',
            transition: 'all 0.2s',
            '&:hover': {
                bgcolor: (theme: any) => alpha(theme.palette.action.hover, 0.8),
                borderColor: 'primary.main',
                boxShadow: (theme: any) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.05)}`
            }
        },
        commentBox: {
            p: 2,
            bgcolor: (theme: any) => theme.palette.mode === 'light'
                ? alpha('#fff', 0.6)
                : alpha(theme.palette.background.paper, 0.4),
            borderRadius: 1,
            border: '1px solid',
            borderColor: (theme: any) => alpha(theme.palette.divider, 0.4),
            transition: 'all 0.2s',
            '&:hover': {
                borderColor: (theme: any) => alpha(theme.palette.primary.main, 0.3),
                transform: 'translateX(4px)',
                bgcolor: (theme: any) => theme.palette.mode === 'light'
                    ? '#fff'
                    : alpha(theme.palette.background.paper, 0.6),
            }
        },
        commentHeaderStack: { mb: 1 },
        commentAvatar: {
            width: 32,
            height: 32,
            fontSize: '0.8rem',
            border: '1.5px solid',
            borderColor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        },
        commentAuthor: { fontWeight: 800, fontSize: '0.9rem', color: 'text.primary' },
        commentText: {
            fontSize: '0.95rem',
            color: 'text.secondary',
            lineHeight: 1.6,
            '& p': { mb: 0 }
        }
    };


    const [shareModalOpen, setShareModalOpen] = useState(false);

    return (
        <>
            <Grow in timeout={500 + index * 100}>
                <Card elevation={0} sx={styles.postCard}>
                    <CardHeader
                        sx={styles.postCardHeader}
                        avatar={
                            <Avatar
                                src={post.author?.avatar}
                                sx={styles.postCardHeaderAvatar}
                            >
                                {!post.author?.avatar && (post.author?.name?.[0]?.toUpperCase() || '?')}
                            </Avatar>
                        }
                        title={
                            <Stack>
                                <Typography sx={styles.postCardHeaderTitle}>{post.author.name || "Unknown Author"}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Rating
                                        value={averageRating}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                        sx={{
                                            fontSize: '0.85rem',
                                            color: 'primary.main',
                                            '& .MuiRating-iconEmpty': { color: (theme) => alpha(theme.palette.text.disabled, 0.3) }
                                        }}
                                    />
                                    <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700 }}>
                                        ({post.ratings?.length || 0})
                                    </Typography>
                                    <Box sx={{ width: 4, height: 4, bgcolor: 'text.disabled', borderRadius: '50%', opacity: 0.5 }} />
                                    <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>
                                        {formatDistanceToNow(new Date(post.createdAt))} ago
                                    </Typography>
                                </Stack>
                            </Stack>
                        }
                        action={
                            post.author._id === user?._id && (handleEditInitiate || handleDelete) && (
                                <Stack direction="row" spacing={1}>
                                    {handleEditInitiate && (
                                        <IconButton size="small" onClick={() => handleEditInitiate?.(post)} sx={{ opacity: 0.6, "&:hover": { opacity: 1, color: 'primary.main' } }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {handleDelete && (
                                        <IconButton size="small" onClick={() => handleDelete?.(post._id)} sx={{ opacity: 0.6, "&:hover": { opacity: 1, color: 'error.main' } }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Stack>
                            )
                        }
                    />
                    <CardContent sx={styles.postContent}>
                        <Typography variant="h4" sx={styles.postTitle}>
                            {post.title}
                        </Typography>

                        {post.imageUrl && (
                            <Box sx={styles.postImageContainer}>
                                <Box sx={styles.mediaTag}>
                                    {post.mediaType === 'video' ? 'Video' : 'Image'}
                                </Box>
                                {post.mediaType === 'video' ? (
                                    <Box
                                        component="video"
                                        src={post.imageUrl}
                                        controls
                                        sx={{
                                            width: '100%',
                                            display: 'block',
                                            borderRadius: 'inherit'
                                        }}
                                    />
                                ) : (
                                    <Box
                                        component="img"
                                        src={post.imageUrl}
                                        alt={post.title}
                                        sx={{
                                            width: '100%',
                                            maxHeight: 550,
                                            objectFit: 'contain',
                                            borderRadius: 'inherit'
                                        }}
                                    />
                                )}
                            </Box>
                        )}

                        {post.tags && post.tags.length > 0 && (
                            <Stack direction="row" spacing={1} mb={2.5} flexWrap="wrap" gap={1}>
                                {post.tags.map((tag, idx) => (
                                    <Chip
                                        key={idx}
                                        label={`#${tag.trim()}`}
                                        size="small"
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: '0.7rem',
                                            bgcolor: (theme: any) => alpha(theme.palette.primary.main, 0.05),
                                            border: '1px solid',
                                            borderColor: (theme: any) => alpha(theme.palette.primary.main, 0.1),
                                            color: 'primary.main',
                                            '&:hover': {
                                                bgcolor: (theme: any) => alpha(theme.palette.primary.main, 0.1),
                                            }
                                        }}
                                    />
                                ))}
                            </Stack>
                        )}

                        <Box
                            sx={styles.postHtmlContent}
                            dangerouslySetInnerHTML={{ __html: post.content }}

                        />

                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={styles.interactionRow}>
                            <Stack direction="row" spacing={{ xs: 0.5, sm: 2 }} alignItems="center">
                                <Box
                                    sx={{ ...styles.actionButton, color: post.likes.includes(user?._id || "") ? "error.main" : "text.secondary" }}
                                    onClick={() => handleLike?.(post._id)}
                                >
                                    {post.likes.includes(user?._id || "") ? <LikeIcon /> : <LikeBorderIcon />}
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{post.likes.length}</Typography>
                                </Box>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Tooltip title="Add Comment">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openCommentModal?.(post._id);
                                            }}
                                            sx={{
                                                color: 'primary.main',
                                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                                                '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }
                                            }}
                                        >
                                            <CommentIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Box
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleComments?.(post._id);
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 2,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                '& .MuiTypography-root': { color: 'primary.main' }
                                            }
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                            {post.comments.length}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                                            {post.comments.length === 1 ? 'comment' : 'comments'}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Box
                                    sx={{ ...styles.actionButton }}
                                    onClick={() => setShareModalOpen(true)}
                                >
                                    <ShareIcon />
                                    <Typography variant="body2" sx={{ fontWeight: 800, display: { xs: 'none', sm: 'block' } }}>Share</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, gap: 1 }}>
                                    <Rating
                                        value={userRating}
                                        onChange={(_, value) => handleRate?.(post._id, value || 0)}
                                        size="small"
                                        sx={{
                                            '& .MuiRating-iconFilled': { color: 'primary.main' },
                                            '&:hover .MuiRating-iconFilled': { color: 'primary.dark' }
                                        }}
                                    />
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.6, display: { xs: 'none', sm: 'block' } }}>
                                    {Math.ceil(post.content.length / 500)} min read
                                </Typography>

                                <IconButton
                                    size="small"
                                    onClick={() => handleSave?.(post._id)}
                                    sx={post.savedBy?.includes(user?._id || "") ? styles.saveButtonActive : styles.saveButton}
                                >
                                    {post.savedBy?.includes(user?._id || "") ? <SavedIcon fontSize="small" /> : <SaveIcon fontSize="small" />}
                                </IconButton>
                            </Stack>
                        </Stack>
                    </CardContent>
                    {/* Comments Section */}
                    <Collapse in={isCommentsExpanded}>
                        <Box sx={styles.commentsSection}>
                            <Box
                                sx={styles.commentsHeader}
                                onClick={() => toggleComments?.(post._id)}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Reviews & Discussion ({post.comments.length})
                                    <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.6 }}>
                                        — {isCommentsExpanded ? 'Hide' : 'Show'}
                                    </Typography>
                                </Typography>
                            </Box>

                            {user && (
                                <Box
                                    sx={styles.commentTrigger}
                                    onClick={() => openCommentModal?.(post._id)}
                                >
                                    <Avatar
                                        src={user.avatar}
                                        sx={{ width: 32, height: 32, border: '1px solid', borderColor: 'divider' }}
                                    >
                                        {user.name?.[0]?.toUpperCase()}
                                    </Avatar>
                                    <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 500 }}>
                                        Write a comment...
                                    </Typography>
                                    <IconButton size="small" sx={{ ml: 'auto', color: 'secondry.main' }}>
                                        <CommentIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}

                            <Grid container spacing={2}>
                                {post.comments.map(comment => (
                                    <Grid item xs={12} key={comment._id}>
                                        <Box sx={styles.commentBox}>
                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={styles.commentHeaderStack}>
                                                <Avatar
                                                    src={comment.user?.avatar}
                                                    sx={styles.commentAvatar}
                                                >
                                                    {comment.user?.name?.[0]?.toUpperCase() || "?"}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={styles.commentAuthor}>
                                                        {comment.user?.name || "Anonymous"}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', lineHeight: 1, fontWeight: 600 }}>
                                                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                                                    </Typography>
                                                </Box>
                                                {comment.user?._id === user?._id && handleDeleteComment && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteComment(post._id, comment._id);
                                                        }}
                                                        sx={{ ml: 'auto', opacity: 0.5, '&:hover': { opacity: 1, color: 'error.main' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Stack>
                                            <Box
                                                sx={{ ...styles.commentText, mt: 1, ml: { xs: 0, sm: 5.8 } }}
                                                dangerouslySetInnerHTML={{ __html: comment.text }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                                {post.comments.length === 0 && (
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                py: 4,
                                                textAlign: 'center',
                                                bgcolor: (theme: any) => alpha(theme.palette.action.hover, 0.3),
                                                borderRadius: 4,
                                                border: '1px dashed',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7, fontStyle: 'italic', fontWeight: 600 }}>
                                                No comments yet. Start the discussion!
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Collapse>
                </Card>
            </Grow>
            <SharePostModal
                open={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                postId={post._id}
                postTitle={post.title}
            />
        </>
    );
};

export default PostItem;