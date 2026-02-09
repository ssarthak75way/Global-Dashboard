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
