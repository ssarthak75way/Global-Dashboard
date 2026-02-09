import mongoose, { Document, Schema } from "mongoose";

export interface IComment {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
}

export interface IPost extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    imageUrl?: string;
    likes: mongoose.Types.ObjectId[];
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        imageUrl: { type: String },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        comments: [commentSchema],
    },
    { timestamps: true }
);

export default mongoose.model<IPost>("Post", postSchema);
