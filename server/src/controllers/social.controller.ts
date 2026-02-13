import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User from "../models/user.model";

export const getGitHubStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await User.findById(userId);
        if (!user || !user.socialHandles?.github) {
            res.status(404).json({ message: "GitHub handle not configured" });
            return;
        }

        // GitHub handle is now stored directly
        const username = user.socialHandles.github;

        // Fetch GitHub Profile
        const profileRes = await axios.get(`https://api.github.com/users/${username}`);

        const { followers, public_repos, public_gists, avatar_url, bio } = profileRes.data;

        // Fetch Contribution Data (using a public proxy/API for simplicity)
        let contributions = [];
        try {
            const contribRes = await axios.get(`https://github-contributions-api.deno.dev/${username}.json`);
            contributions = contribRes.data.contributions || [];
        } catch (err) {
            console.error("Failed to fetch GitHub contributions", err);
            // Fallback to empty if proxy fails
        }

        res.status(200).json({
            profile: {
                followers,
                repos: public_repos,
                gists: public_gists,
                avatar: avatar_url,
                bio,
                username
            },
            contributions
        });
    } catch (error: unknown) {
        let errorMessage = "Failed to fetch GitHub data";
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            errorMessage = error.message;
            statusCode = error.response?.status || 500;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("GitHub Stats Error:", errorMessage);
        res.status(statusCode).json({
            message: "Failed to fetch GitHub data",
            error: errorMessage
        });
    }
};

export const getLeetCodeStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if (!user || !user.socialHandles?.leetcode) {
            res.status(404).json({ message: "LeetCode handle not configured" });
            return;
        }

        const username = user.socialHandles.leetcode;
        const { data } = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);

        if (data.status === "error") {
            res.status(400).json({ message: data.message || "LeetCode user not found" });
            return;
        }

        res.status(200).json({
            username,
            totalSolved: data.totalSolved,
            easySolved: data.easySolved,
            mediumSolved: data.mediumSolved,
            hardSolved: data.hardSolved,
            acceptanceRate: data.acceptanceRate,
            ranking: data.ranking,
            contributionPoints: data.contributionPoints,
            reputation: data.reputation
        });
    } catch (error: unknown) {
        let errorMessage = "Failed to fetch LeetCode data";
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            errorMessage = error.message;
            statusCode = error.response?.status || 500;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("LeetCode Stats Error:", errorMessage);
        res.status(statusCode).json({
            message: "Failed to fetch LeetCode data",
            error: errorMessage
        });
    }
};

export const getCodeforcesStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if (!user || !user.socialHandles?.codeforces) {
            res.status(404).json({ message: "Codeforces handle not configured" });
            return;
        }

        const username = user.socialHandles.codeforces;
        const { data } = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);

        if (data.status !== "OK") {
            res.status(400).json({ message: "Codeforces user not found" });
            return;
        }

        const info = data.result[0];
        res.status(200).json({
            username,
            rating: info.rating,
            maxRating: info.maxRating,
            rank: info.rank,
            maxRank: info.maxRank,
            avatar: info.titlePhoto || info.avatar
        });
    } catch (error: unknown) {
        let errorMessage = "Failed to fetch Codeforces data";
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            errorMessage = error.message;
            statusCode = error.response?.status || 500;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Codeforces Stats Error:", errorMessage);
        res.status(statusCode).json({
            message: "Failed to fetch Codeforces data",
            error: errorMessage
        });
    }
};

// Follow User
export const followUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const targetUserId = req.params.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (userId.toString() === targetUserId) {
            res.status(400).json({ message: "You cannot follow yourself" });
            return;
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Add to followers and following using $addToSet to prevent duplicates
        // Update target user's followers
        await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: userId } });
        // Update current user's following
        await User.findByIdAndUpdate(userId, { $addToSet: { following: targetUserId } });

        res.status(200).json({ message: "User followed successfully" });
    } catch (error: unknown) {
        console.error("Follow User Error:", error);
        res.status(500).json({ message: "Failed to follow user" });
    }
};

// Unfollow User
export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const targetUserId = req.params.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Remove from followers and following
        await User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { following: targetUserId } });

        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error: unknown) {
        console.error("Unfollow User Error:", error);
        res.status(500).json({ message: "Failed to unfollow user" });
    }
};

// Get Network (Followers/Following)
export const getNetwork = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
            .populate("followers", "name email avatar isVerified socialHandles")
            .populate("following", "name email avatar isVerified socialHandles");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            followers: user.followers,
            following: user.following,
            followersCount: user.followers.length,
            followingCount: user.following.length
        });
    } catch (error: unknown) {
        console.error("Get Network Error:", error);
        res.status(500).json({ message: "Failed to fetch network" });
    }
};

// Search Users
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = req.query.q as string;
        if (!query) {
            res.status(400).json({ message: "Search query is required" });
            return;
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        })
            .select("name email avatar isVerified _id socialHandles")
            .limit(10);

        res.status(200).json(users);
    } catch (error: unknown) {
        console.error("Search Users Error:", error);
        res.status(500).json({ message: "Failed to search users" });
    }
};
