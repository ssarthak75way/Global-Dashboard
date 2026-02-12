import { useState, useEffect } from "react";
import {
    Box,
    Stack,
    Fade
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/Loader";

// Modular Components
import FeedHeader from "../components/feed/FeedHeader";
import CreatePost from "../components/feed/CreatePost";
import PostItem from "../components/feed/PostItem";
import CommentModal from "../components/feed/CommentModal";

interface Comment {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar:string;
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
        avatar:string;
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

    const styles = {
        loadingContainer: { display: "flex", justifyContent: "center", mt: 8 },
        mainContainer: { maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3 }, pb: 8, minHeight:"100vh" }
    };

    if (loading) return (
        <Box sx={styles.loadingContainer}>
            <Loader />
        </Box>
    );

    return (
        <Fade in timeout={800}>
            <Box sx={styles.mainContainer}>
                <FeedHeader />

                <CreatePost
                    user={user}
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    handleCreatePost={handleCreatePost}
                    submitting={submitting}
                    uploading={uploading}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    editingPostId={editingPostId}
                    resetForm={resetForm}
                    handleImageUpload={handleImageUpload}
                />

                <Stack spacing={4}>
                    {posts.map((post, index) => (
                        <PostItem
                            key={post._id}
                            post={post}
                            index={index}
                            user={user}
                            handleEditInitiate={handleEditInitiate}
                            handleDelete={handleDelete}
                            handleLike={handleLike}
                            toggleComments={toggleComments}
                            isCommentsExpanded={!!expandedComments[post._id]}
                            openCommentModal={openCommentModal}
                        />
                    ))}
                </Stack>

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