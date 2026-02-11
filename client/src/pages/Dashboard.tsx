import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Box, Fade } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TerminalIcon from "@mui/icons-material/Terminal";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import DashboardGrid from "../components/dashboard/DashboardGrid";

interface CardData {
    id: string;
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    description: string;
    platform: string;
}

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/auth/stats");
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards: CardData[] = [
        {
            id: 'github-repos',
            label: 'Repositories',
            value: loading ? '...' : (stats?.github?.profile?.repos || 0),
            icon: <GitHubIcon />,
            color: '#6366f1',
            description: 'Total GitHub repositories',
            platform: 'GitHub'
        },
        {
            id: 'github-followers',
            label: 'Followers',
            value: loading ? '...' : (stats?.github?.profile?.followers || 0),
            icon: <GitHubIcon />,
            color: '#8b5cf6',
            description: 'GitHub followers count',
            platform: 'GitHub'
        },
        {
            id: 'leetcode-solved',
            label: 'Problems Solved',
            value: loading ? '...' : (stats?.leetcode?.totalSolved || 0),
            icon: <TerminalIcon />,
            color: '#f59e0b',
            description: 'LeetCode problems solved',
            platform: 'LeetCode'
        },
        {
            id: 'leetcode-ranking',
            label: 'Global Ranking',
            value: loading ? '...' : (stats?.leetcode?.ranking || 'N/A'),
            icon: <EmojiEventsIcon />,
            color: '#10b981',
            description: 'LeetCode global rank',
            platform: 'LeetCode'
        },
        {
            id: 'codeforces-rating',
            label: 'Rating',
            value: loading ? '...' : (stats?.codeforces?.rating || 0),
            icon: <EmojiEventsIcon />,
            color: '#ef4444',
            description: 'Codeforces rating',
            platform: 'Codeforces'
        },
        {
            id: 'linkedin-connections',
            label: 'Connections',
            value: loading ? '...' : (stats?.linkedin?.connections || 0),
            icon: <LinkedInIcon />,
            color: '#0ea5e9',
            description: 'LinkedIn connections',
            platform: 'LinkedIn'
        }
    ];

    return (
        <Fade in timeout={800}>
            <Box>
                <WelcomeSection />
                <DashboardGrid initialCards={cards} />
            </Box>
        </Fade>
    );
};

export default Dashboard;
