import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";

interface DecodedToken extends JwtPayload {
    userId: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET || "access_secret"
            ) as DecodedToken;

            const user = await User.findById(decoded.userId).select("-password -refreshToken");

            if (!user) {
                res.status(401).json({ message: "Not authorized, user not found" });
                return;
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
        return;
    }
};
