import { Request, Response } from "express";
import Post from "../models/post.model";
import User from "../models/user.model";
import { v4 as uuidv4 } from 'uuid';

// Create Post
export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, imageUrl, tags } = req.body;
        const userId = req.user?._id;

        const post = await Post.create({
            title,
            content,
            author: userId,
            imageUrl,
            tags: tags || []
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
        const { search } = req.query;
        let query: any = {};

        if (search) {
            const searchTerm = search as string;

            if (searchTerm.startsWith('#')) {
                // Search by tag
                const tag = searchTerm.substring(1);
                query = { tags: { $regex: new RegExp(tag, 'i') } };
            } else if (searchTerm.startsWith('@')) {
                // Search by username/author
                const username = searchTerm.substring(1);

                // Find users matching the name
                const users = await User.find({
                    name: { $regex: new RegExp(username, 'i') }
                }).select('_id');

                const userIds = users.map(user => user._id);

                query = {
                    $or: [
                        { author: { $in: userIds } },
                        { content: { $regex: new RegExp(searchTerm, 'i') } } // Also search for @mention in content
                    ]
                };
            } else {
                // "Search Everywhere"
                const regex = new RegExp(searchTerm, 'i');

                // Find users matching the name to search by author
                const users = await User.find({
                    name: { $regex: regex }
                }).select('_id');
                const userIds = users.map(user => user._id);

                query = {
                    $or: [
                        { title: { $regex: regex } },
                        { content: { $regex: regex } },
                        { tags: { $in: [regex] } },
                        { "comments.text": { $regex: regex } }, // Search in comments
                        { author: { $in: userIds } } // Search by author
                    ]
                };
            }
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const random = req.query.random === 'true';

        let posts;
        if (Object.keys(query).length > 0) {
            // Search mode: standard pagination, no infinite random loop
            posts = await Post.find(query)
                .populate("author", "email avatar name")
                .populate("comments.user", "name avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
        } else if (random) {
            // New: Explicit Random Feed Mode
            const randomPosts = await Post.aggregate([
                { $sample: { size: limit } }
            ]);

            const populatedPosts = await Post.populate(randomPosts, [
                { path: "author", select: "email avatar name" },
                { path: "comments.user", select: "name avatar" }
            ]);

            posts = populatedPosts.map((p: any) => {
                const postObj = p.toObject ? p.toObject() : p;
                return {
                    ...postObj,
                    _id: uuidv4(),
                    originalId: postObj._id,
                    isRandom: true
                };
            });
        } else {
            // Feed mode: Infinite Loop
            const totalPosts = await Post.countDocuments();

            if (skip < totalPosts) {
                // Normal chronological feed
                posts = await Post.find()
                    .populate("author", "email avatar name")
                    .populate("comments.user", "name avatar")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
            } else {
                // End of feed: Start Random Loop
                // Use sample to get random posts
                const randomPosts = await Post.aggregate([
                    { $sample: { size: limit } }
                ]);

                // Populate random posts
                let populatedPosts = await Post.populate(randomPosts, [
                    { path: "author", select: "email avatar name" },
                    { path: "comments.user", select: "name avatar" }
                ]);

                // Morph posts to have unique IDs so client doesn't filter them as duplicates
                posts = populatedPosts.map((p: any) => {
                    const postObj = p.toObject ? p.toObject() : p;
                    return {
                        ...postObj,
                        _id: uuidv4(), // New unique key for React
                        originalId: postObj._id, // Keep verify real ID for interactions
                        isRandom: true
                    };
                });
            }
        }

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


        const likeIndex = post.likes.findIndex((like) => like.toString() === userId.toString());
        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        // ... inside toggleSavePost ...

        const savedIndex = post.savedBy.findIndex((save) => save.toString() === userId.toString());

        if (savedIndex === -1) {
            post.savedBy.push(userId);
        } else {
            post.savedBy.splice(savedIndex, 1);
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
        const { title, content, imageUrl, tags } = req.body;
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
        post.tags = tags !== undefined ? tags : post.tags;

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
// Get Liked Posts
export const getLikedPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const posts = await Post.find({ likes: userId })
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

// Get Commented Posts
export const getCommentedPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const posts = await Post.find({ "comments.user": userId })
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
// Delete Comment
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, commentId } = req.params;
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

        const comment = post.comments.find(c => (c as any)._id.toString() === commentId);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }

        if (comment.user.toString() !== userId.toString()) {
            res.status(403).json({ message: "Unauthorized to delete this comment" });
            return;
        }

        post.comments = post.comments.filter(c => (c as any)._id.toString() !== commentId);

        await post.save();
        await post.populate("author", "email name");
        await post.populate("comments.user", "name avatar");

        res.status(200).json(post);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Rate Post
export const ratePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { score } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        if (typeof score !== 'number' || score < 1 || score > 5) {
            res.status(400).json({ message: "Invalid rating score. Must be between 1 and 5." });
            return;
        }

        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        const existingRatingIndex = post.ratings.findIndex(r => r.user.toString() === userId.toString());

        if (existingRatingIndex !== -1) {
            post.ratings[existingRatingIndex].score = score;
        } else {
            post.ratings.push({ user: userId, score });
        }

        await post.save();
        await post.populate("author", "email name avatar");
        await post.populate("comments.user", "name avatar");

        res.status(200).json(post);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Toggle Save Post
export const toggleSavePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        const savedIndex = post.savedBy.indexOf(userId);

        if (savedIndex === -1) {
            post.savedBy.push(userId);
        } else {
            post.savedBy.splice(savedIndex, 1);
        }

        await post.save();
        await post.populate("author", "email name avatar");
        await post.populate("comments.user", "name avatar");

        res.status(200).json(post);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Get Saved Posts
export const getSavedPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        const posts = await Post.find({ savedBy: userId })
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
