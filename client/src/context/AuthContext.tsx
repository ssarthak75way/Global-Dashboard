import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

export interface User {
    _id: string;
    email: string;
    name?: string;
    age?: number;
    socialHandles?: {
        github?: string;
        codeforces?: string;
        leetcode?: string;
        linkedin?: string;
    };
    bio?: string;
    about?: string;
    experience?: Array<{
        role: string;
        company: string;
        startDate: Date | string;
        endDate?: Date | string;
        description?: string;
        current: boolean;
        jobType?: 'Remote' | 'Onsite' | 'Hybrid';
        technologies?: string[];
    }>;
    projects?: Array<{
        title: string;
        startDate: Date | string;
        endDate?: Date | string;
        description?: string;
        techStack: string[];
        link?: string;
    }>;
    certifications?: Array<{
        title: string;
        issuer: string;
        issueDate: Date | string;
        expiryDate?: Date | string;
        description?: string;
        credentialId?: string;
        link?: string;
    }>;
    skills?: string[];
    hobbies?: string[];
    isVerified: boolean;
    avatar?: string;
    dashboardOrder?: string[];
    followers: string[];
    following: string[];
    createdAt?: string;
    status?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    expiryTime: number | null;
    loading: boolean;
    login: (userData: User, token: string, expiresAt?: number) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
    checkAuth: () => Promise<void>;
    fetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [accessToken, setAccessTokenState] = useState<string | null>(window.accessToken || null);
    const [expiryTime, setExpiryTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const hasInitialCheck = React.useRef(false);
    const setAccessToken = (token: string | null) => {
        setAccessTokenState(token);
        window.accessToken = token;
    };

    const login = (userData: User, token: string, expiresAt?: number) => {
        setUser(userData);
        setAccessToken(token);
        if (expiresAt) setExpiryTime(expiresAt);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error", error);
        }
        setUser(null);
        setAccessToken(null);
        setExpiryTime(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expiryTime");
    };

    const updateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const checkAuth = async () => {
        if (hasInitialCheck.current) return;
        hasInitialCheck.current = true;

        try {
            const { data } = await api.get("/auth/refresh");
            const newAccessToken = data.accessToken;
            setAccessToken(newAccessToken);
            if (data.expiresAt) setExpiryTime(data.expiresAt);


            await fetchMe();
        } catch (error) {
            setUser(null);
            setAccessToken(null);
            setExpiryTime(null);
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    };

    const fetchMe = async () => {
        try {
            const { data } = await api.get("/auth/me");
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
            console.error("Failed to fetch user profile", error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, accessToken, expiryTime, loading, login, logout, updateUser, checkAuth, fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
