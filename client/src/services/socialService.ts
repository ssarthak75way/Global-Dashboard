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
