import { Request, Response } from "express";
import User from "../models/user.model";
import generateTokens from "../utils/generateToken";
import sendEmail from "../utils/mailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import qs from "qs";


// Signup
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const user = await User.create({
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        if (user) {
            await sendEmail(email, "Verify your email", `Your OTP is ${otp}`);
            res.status(201).json({
                message: "User created via OTP sent to email",
                userId: user._id,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Verify OTP
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;

        // Generate tokens immediately after verification or force login? 
        // Usually usually seamless login after verification is better UX.
        // Cast strictly to string for mongoose ObjectId
        const { accessToken, refreshToken } = generateTokens(user._id.toString(), res);

        user.refreshToken.push(refreshToken);
        await user.save();

        res.status(200).json({
            _id: user._id,
            email: user.email,
            isVerified: user.isVerified,
            accessToken,
            expiresAt: (new Date()).getTime() + 15 * 60 * 1000,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password || ""))) {
            if (!user.isVerified) {
                res.status(401).json({ message: "Please verify your email first" });
                return;
            }

            const { accessToken, refreshToken } = generateTokens(user._id.toString(), res);

            // Keep only last 5 refresh tokens for device management if needed, or just push
            user.refreshToken = [...user.refreshToken, refreshToken];
            await user.save();

            res.json({
                _id: user._id,
                email: user.email,
                isVerified: user.isVerified,
                accessToken,
                expiresAt: (new Date()).getTime() + 15 * 60 * 1000,
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Refresh Token
export const refresh = async (req: Request, res: Response): Promise<void> => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.sendStatus(401);
        return;
    }

    const refreshToken = cookies.jwt;

    try {
        interface DecodedToken extends jwt.JwtPayload {
            userId: string;
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "refresh_secret") as DecodedToken;
        const user = await User.findOne({ _id: decoded.userId }).exec();

        if (!user) {
            res.sendStatus(403); // Forbidden
            return;
        }

        // Check if refresh token is in database
        if (!user.refreshToken.includes(refreshToken)) {
            // Token reuse detected! Potential theft.
            user.refreshToken = []; // Clear all tokens
            await user.save();
            res.sendStatus(403);
            return;
        }

        // Token rotation
        const newTokens = generateTokens(user._id.toString(), res);
        const newRefreshToken = newTokens.refreshToken;

        user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);
        user.refreshToken.push(newRefreshToken);
        await user.save();

        res.json({
            accessToken: newTokens.accessToken,
            expiresAt: newTokens.expiresAt,
            user: {
                _id: user._id,
                email: user.email,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        res.sendStatus(403);
    }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.sendStatus(204); // No content
        return;
    }
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const user = await User.findOne({ refreshToken }).exec();
    if (!user) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV !== "development" });
        res.sendStatus(204);
        return;
    }

    // Delete refreshToken in db
    user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);
    await user.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV !== "development" });
    res.sendStatus(204);
};

// Update Profile
// Get current user profile
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { name, age, socialHandles } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (name !== undefined) user.name = name;
        if (age !== undefined) user.age = age;
        if (socialHandles) {
            user.socialHandles = {
                ...user.socialHandles,
                ...socialHandles
            };
        }

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                age: user.age,
                socialHandles: user.socialHandles,
                dashboardOrder: user.dashboardOrder,
                isVerified: user.isVerified
            }
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Update Dashboard Order
export const updateDashboardOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const { order } = req.body;

        if (!Array.isArray(order)) {
            res.status(400).json({ message: "Order must be an array" });
            return;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { dashboardOrder: order },
            { new: true }
        ).select("-password -refreshToken");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "Dashboard order updated", order: user.dashboardOrder });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Google Login Redirect
export const googleLogin = (req: Request, res: Response): void => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    const qs = new URLSearchParams(options);
    res.redirect(`${rootUrl}?${qs.toString()}`);
};

// Google Callback
export const googleCallback = async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code as string;

    if (!code) {
        res.redirect("http://localhost:5173/login?error=GoogleAuthFailed");
        return;
    }

    try {
        const { id_token, access_token } = await getGoogleOAuthTokens({ code });
        const googleUser = await getGoogleUser({ id_token, access_token });

        if (!googleUser.verified_email) {
            res.redirect("http://localhost:5173/login?error=GoogleEmailNotVerified");
            return;
        }

        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            user = await User.create({
                email: googleUser.email,
                isVerified: true,
                googleId: googleUser.id,
            });
        } else {
            if (!user.googleId) {
                user.googleId = googleUser.id;
            }
            if (!user.isVerified) {
                user.isVerified = true;
            }
            await user.save();
        }

        const { accessToken, refreshToken } = generateTokens(user._id.toString(), res);

        user.refreshToken.push(refreshToken);
        await user.save();

        res.redirect("http://localhost:5173/dashboard");
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.redirect("http://localhost:5173/login?error=ServerGoogleAuthError");
    }
};


interface GoogleTokensResult {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
}

async function getGoogleOAuthTokens({ code }: { code: string }): Promise<GoogleTokensResult> {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
        grant_type: "authorization_code",
    };

    try {
        const res = await axios.post<GoogleTokensResult>(url, qs.stringify(values), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return res.data;
    } catch (error: unknown) {
        console.error("Failed to fetch Google Oauth Tokens");
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Unknown error during Google Token exchange");
        }

    }
}

interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

async function getGoogleUser({ id_token, access_token }: { id_token: string; access_token: string }): Promise<GoogleUserResult> {
    try {
        const res = await axios.get<GoogleUserResult>(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );
        return res.data;
    } catch (error: unknown) {
        console.error("Failed to fetch Google User");
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Unknown error during Google User fetch");
        }
    }
}
