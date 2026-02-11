import jwt from "jsonwebtoken";
import { Response } from "express";

const generateTokens = (userId: string, res: Response) => {
    const accessTokenExpiresIn = 30;
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET || "access_secret", {
        expiresIn: `${accessTokenExpiresIn}m`,
    }); 

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET || "refresh_secret", {
        expiresIn: "7d",
    });

    // Calculate expiresAt (current time + 15 minutes)
    const expiresAt = Date.now() + accessTokenExpiresIn * 60 * 1000;

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken, refreshToken, expiresAt };
};

export default generateTokens;
