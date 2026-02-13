import api from "../api/axios";

export const followUser = (userId: string) => {
    return api.post(`/social/follow/${userId}`);
};

export const unfollowUser = (userId: string) => {
    return api.post(`/social/unfollow/${userId}`);
};

export const getNetwork = (userId: string) => {
    return api.get(`/social/network/${userId}`);
};

export const getUserById = (userId: string) => {
    return api.get(`/auth/user/${userId}`);
};

export const searchUsers = (query: string) => {
    return api.get(`/social/search?q=${encodeURIComponent(query)}`);
};
export const getLikedPosts = () => {
    return api.get("/posts/liked");
};

export const getCommentedPosts = () => {
    return api.get("/posts/commented");
};
export const deleteComment = (postId: string, commentId: string) => {
    return api.delete(`/posts/${postId}/comment/${commentId}`);
};

export const ratePost = (postId: string, score: number) => {
    return api.post(`/posts/${postId}/rate`, { score });
};
