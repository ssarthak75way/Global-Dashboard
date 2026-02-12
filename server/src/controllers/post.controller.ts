import { Request, Response } from "express";
import Post from "../models/post.model";

// Create Post
export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, imageUrl } = req.body;
        const userId = req.user?._id;

        const post = await Post.create({
            title,
            content,
            author: userId,
            imageUrl
        });

        await post.populate("author", "email name");

        res.status(201).json(post);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Get All Posts
export const getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Post.find()
            .populate("author", "email avatar name")
            .populate("comments.user", "name avatar")
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Like/Unlike Post
export const likePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        await post.populate("author", "email name");
        await post.populate("comments.user", "name");

        res.status(200).json(post);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Add Comment
export const addComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user?._id;

        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        post.comments.push({
            user: userId,
            text,
            createdAt: new Date()
        });

        await post.save();
        await post.populate("author", "email name");
        await post.populate("comments.user", "name");

        res.status(200).json(post);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Upload Image
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        res.status(200).json({
            imageUrl: req.file.path, // Cloudinary URL
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Update Post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, content, imageUrl } = req.body;
        const userId = req.user?._id;

        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (!userId || post.author.toString() !== userId.toString()) {
            res.status(403).json({ message: "Unauthorized to edit this post" });
            return;
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.imageUrl = imageUrl !== undefined ? imageUrl : post.imageUrl;

        await post.save();
        await post.populate("author", "email name");
        await post.populate("comments.user", "name");

        res.status(200).json(post);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Delete Post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (!userId || post.author.toString() !== userId.toString()) {
            res.status(403).json({ message: "Unauthorized to delete this post" });
            return;
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
