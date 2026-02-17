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
    Grid,
    CardHeader
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
    user: { _id: string } | null;
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
    handleSave
}: PostItemProps) => {
    const styles = {
        postCard: {
            maxWidth: '100%',
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            transition: "all 0.3s ease",
            "&:hover": {
                borderColor: "primary.light",
                transform: { xs: 'none', sm: "translateY(-4px)" },
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
            }
        },
        postCardHeader: {
            px: { xs: 2, sm: 3 },
            pt: 2,
            pb: 1,
            "& .MuiCardHeader-avatar": {
                marginRight: 2
            }
        },
        postCardHeaderAvatar: {
            bgcolor: "secondary.main",
            fontWeight: 700,
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            fontSize: { xs: '0.8rem', sm: '1rem' }
        },
        postCardHeaderTitle: {
            fontWeight: 700,
            fontSize: { xs: '0.9rem', sm: '1rem' }
        },
        postCardTimeIcon: { fontSize: "0.8rem", color: "text.disabled" },
        postEditIcon: { color: "primary.main" },
        postDeleteIcon: { color: "error.main" },
        postContent: { pt: 0, px: { xs: 2, sm: 3 }, pb: "24px !important" },
        postTitle: {
            fontWeight: 800,
            mb: 1.5,
            lineHeight: 1.3,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
        },
        postImageContainer: {
            mx: { xs: -2, sm: -3 }, // Bleed to edge of card
            mb: 3,
            mt: 2,
            overflow: "hidden",
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider"
        },
        postImage: {
            width: "100%",
            maxHeight: "500px", // Prevent super tall images
            objectFit: "contain", // Show full image
            bgcolor: "black",
            display: "block"
        },
        postHtmlContent: {
            mb: 3,
            "& p": { mb: 1.5, lineHeight: 1.6, fontSize: { xs: "0.95rem", sm: "1rem" } },
            "& h1, h2, h3": { mb: 1.5, fontWeight: 800, fontSize: '1.2rem', mt: 2 },
            "& pre": {
                bgcolor: "action.hover",
                p: 2,
                borderRadius: 2,
                overflowX: "auto",
                mb: 2,
                fontSize: '0.85em',
                maxWidth: '100%'
            },
            "& img": { maxWidth: "100%", height: "auto", borderRadius: 1 },
            "& blockquote": {
                borderLeft: "4px solid",
                borderColor: "primary.main",
                pl: 2,
                ml: 0,
                fontStyle: "italic",
                mb: 2,
                color: "text.secondary"
            },
            "& ul, ol": { pl: 3, mb: 2 }
        },
        divider: { mb: 2, opacity: 0.5 },
        commentsSection: { mt: 3, pt: 2, borderTop: "1px dashed", borderColor: "divider" },
        commentsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 },
        addCommentButton: { borderRadius: "20px" },
        commentBox: {
            p: 1.5,
            bgcolor: "action.hover",
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column"
        },
        commentHeaderStack: { mb: 0.5 },
        commentAvatar: { width: 24, height: 24, fontSize: "0.7rem", bgcolor: "secondary.main" },
        commentAuthor: { fontWeight: 700, fontSize: '0.85rem' },
        commentText: {
            fontSize: '0.9rem',
            wordBreak: "break-word",
            "& p": { m: 0 }
        }
    };


    const [shareModalOpen, setShareModalOpen] = useState(false);

    return (
        <>
            <Grow in timeout={500 + index * 100}>
                <Card elevation={0} sx={styles.postCard}>
                    {post.imageUrl && (
                        <Box sx={{
                            height: 200,
                            overflow: 'hidden',
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Box
                                component="img"
                                src={post.imageUrl}
                                alt={post.title}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
                    )}
                    <CardHeader
                        sx={styles.postCardHeader}
                        avatar={
                            <Avatar src={post.author?.avatar}
                            >
                                {!post.author?.avatar && (post.author?.name?.[0]?.toUpperCase() || post.author?.email?.[0]?.toUpperCase() || '?')}
                            </Avatar>
                        }
                        title={
                            <Stack>
                                <Typography sx={styles.postCardHeaderTitle}>{post.author.name || "Unknown Author"}</Typography>
                                <Typography variant="caption" color="text.disabled">
                                    {formatDistanceToNow(new Date(post.createdAt))} ago
                                </Typography>
                            </Stack>
                        }
                        action={
                            post.author._id === user?._id && (handleEditInitiate || handleDelete) && (
                                <Stack direction="row">
                                    {handleEditInitiate && (
                                        <IconButton size="small" onClick={() => handleEditInitiate?.(post)} sx={styles.postEditIcon}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {handleDelete && (
                                        <IconButton size="small" onClick={() => handleDelete?.(post._id)} sx={styles.postDeleteIcon}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Stack>
                            )
                        }
                    />
                    <CardContent sx={styles.postContent}>
                        <Box sx={{ pl: { sm: 7 } }}>
                            <Typography variant="h4" sx={{ ...styles.postTitle, mb: 1 }}>
                                {post.title}
                            </Typography>

                            {post.tags && post.tags.length > 0 && (
                                <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" gap={1}>
                                    {post.tags.map((tag, idx) => (
                                        <Chip
                                            key={idx}
                                            label={`#${tag.trim()}`}
                                            size="small"
                                            sx={{
                                                bgcolor: 'transparent',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    color: 'primary.main',
                                                    bgcolor: 'action.hover'
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

                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={3} alignItems="center">
                                    <Stack direction="row" spacing={0.5} alignItems="center"
                                        sx={{ cursor: 'pointer', opacity: 0.8, "&:hover": { opacity: 1 } }}
                                        onClick={() => handleLike?.(post._id)}
                                    >
                                        <IconButton size="small" sx={{ color: post.likes.includes(user?._id || "") ? "error.main" : "inherit", p: 0.5 }}>
                                            {post.likes.includes(user?._id || "") ? <LikeIcon /> : <LikeBorderIcon />}
                                        </IconButton>
                                        <Typography variant="body2">{post.likes.length} Reactions</Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={0.5} alignItems="center"
                                        sx={{ cursor: 'pointer', opacity: 0.8, "&:hover": { opacity: 1 } }}
                                        onClick={() => toggleComments?.(post._id)}
                                    >
                                        <IconButton size="small" sx={{ p: 0.5 }}>
                                            <CommentIcon />
                                        </IconButton>
                                        <Typography variant="body2">{post.comments.length} Comments</Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={0.5} alignItems="center"
                                        sx={{ cursor: 'pointer', opacity: 0.8, "&:hover": { opacity: 1 } }}
                                        onClick={() => setShareModalOpen(true)}
                                    >
                                        <IconButton size="small" sx={{ p: 0.5 }}>
                                            <ShareIcon />
                                        </IconButton>
                                        <Typography variant="body2">Share</Typography>
                                    </Stack>
                                </Stack>

                                <Stack direction="row" spacing={1}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        {Math.ceil(post.content.length / 500)} min read
                                    </Typography>

                                    <IconButton
                                        size="small"
                                        onClick={() => handleSave?.(post._id)}
                                        sx={{
                                            bgcolor: post.savedBy?.includes(user?._id || "") ? 'primary.light' : 'action.hover',
                                            color: post.savedBy?.includes(user?._id || "") ? 'primary.main' : 'inherit',
                                            '&:hover': { bgcolor: 'primary.light', color: 'primary.main' }
                                        }}
                                    >
                                        {post.savedBy?.includes(user?._id || "") ? <SavedIcon /> : <SaveIcon />}
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Comments Section */}
                        <Collapse in={isCommentsExpanded}>
                            <Box sx={styles.commentsSection}>
                                <Box sx={{ ...styles.commentsHeader, display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Discussion ({post.comments.length})
                                    </Typography>
                                    {user && (
                                        <Tooltip title="Add Comment">
                                            <IconButton
                                                size="small"
                                                onClick={() => openCommentModal?.(post._id)}
                                                color="primary"
                                                sx={{
                                                    ...styles.addCommentButton,
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    p: 0.5,
                                                    '&:hover': { bgcolor: 'primary.dark' }
                                                }}
                                            >
                                                <CommentIcon sx={{ fontSize: 14 }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>

                                <Grid container spacing={2}>
                                    {post.comments.map(comment => (
                                        <Grid item xs={12} key={comment._id}>
                                            <Box sx={styles.commentBox}>
                                                <Stack direction="row" spacing={1.5} alignItems="center" sx={styles.commentHeaderStack}>
                                                    <Avatar src={comment.user?.avatar}
                                                    >
                                                        {comment.user?.name?.[0]?.toUpperCase() || "?"}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={styles.commentAuthor}>
                                                            {comment.user?.name || "Anonymous"}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', lineHeight: 1 }}>
                                                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                                                        </Typography>
                                                    </Box>
                                                    {comment.user?._id === user?._id && handleDeleteComment && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteComment(post._id, comment._id)}
                                                            sx={{ ml: 'auto', color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Stack>
                                                <Box
                                                    sx={{ ...styles.commentText, mt: 1, ml: 4.5 }}
                                                    dangerouslySetInnerHTML={{ __html: comment.text }}
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                    {post.comments.length === 0 && (
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                                                No comments yet. Start the discussion!
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Collapse>
                    </CardContent>
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