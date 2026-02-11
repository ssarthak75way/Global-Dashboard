import mongoose, { Document, Schema } from "mongoose";

export interface IExperience {
    role: string;
    company: string;
    startDate: Date | string;
    endDate?: Date | string;
    description?: string;
    current: boolean;
    jobType?: 'Remote' | 'Onsite' | 'Hybrid';
    technologies?: string[];
}

export interface IProject {
    title: string;
    startDate: Date | string;
    endDate?: Date | string;
    description?: string;
    techStack: string[];
    link?: string;
}

export interface ICertification {
    title: string;
    issuer: string;
    issueDate: Date | string;
    expiryDate?: Date | string;
    description?: string;
    credentialId?: string;
    link?: string;
}

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
    bio?: string;
    about?: string;
    experience?: IExperience[];
    projects?: IProject[];
    certifications?: ICertification[];
    skills?: string[];
    hobbies?: string[];
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    isVerified: boolean;
    avatar?: string;
    dashboardOrder?: string[];
    otp: string | null;
    otpExpires: Date | null;
    googleId?: string;
    refreshToken: string[];
    status?: string;
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
        bio: { type: String, default: "" },
        about: { type: String, default: "" },
        experience: [{
            role: { type: String, required: true },
            company: { type: String, required: true },
            startDate: { type: Date, required: true },
            endDate: { type: Date },
            description: { type: String },
            current: { type: Boolean, default: false },
            jobType: { type: String, enum: ['Remote', 'Onsite', 'Hybrid'], default: 'Onsite' },
            technologies: { type: [String], default: [] }
        }],
        projects: [{
            title: { type: String, required: true },
            startDate: { type: Date, required: true },
            endDate: { type: Date },
            description: { type: String },
            techStack: [String],
            link: { type: String }
        }],
        certifications: [{
            title: { type: String, required: true },
            issuer: { type: String, required: true },
            issueDate: { type: Date, required: true },
            expiryDate: { type: Date },
            description: { type: String },
            credentialId: { type: String },
            link: { type: String }
        }],
        skills: [String],
        hobbies: [String],
        followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
        following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
        isVerified: { type: Boolean, default: false },
        avatar: { type: String, default: "" },
        dashboardOrder: { type: [String], default: [] },
        otp: { type: String, default: null },
        otpExpires: { type: Date, default: null },
        googleId: { type: String, unique: true, sparse: true },
        refreshToken: { type: [String], default: [] },
        status: { type: String, default: "" }
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
