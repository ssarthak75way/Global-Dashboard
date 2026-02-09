import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password?: string;
    name?: string;
    age?: number;
    socialHandles?: {
        github?: string;
        codeforces?: string;
        leetcode?: string;
        linkedin?: string;
    };
    isVerified: boolean;
    dashboardOrder?: string[];
    otp: string | null;
    otpExpires: Date | null;
    googleId?: string;
    refreshToken: string[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String },
        name: { type: String, default: "" },
        age: { type: Number },
        socialHandles: {
            github: { type: String, default: "" },
            codeforces: { type: String, default: "" },
            leetcode: { type: String, default: "" },
            linkedin: { type: String, default: "" },
        },
        isVerified: { type: Boolean, default: false },
        dashboardOrder: { type: [String], default: [] },
        otp: { type: String, default: null },
        otpExpires: { type: Date, default: null },
        googleId: { type: String, unique: true, sparse: true },
        refreshToken: { type: [String], default: [] },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
