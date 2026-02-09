import { Router } from "express";
import { createPost, getPosts, likePost, addComment, uploadImage, updatePost, deletePost } from "../controllers/post.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createPostSchema } from "../validations/schema";
import multer from "multer";
import { storage } from "../config/cloudinary.config";

const upload = multer({ storage });
const router = Router();

router.get("/", protect, getPosts);
router.post("/", protect, validate(createPostSchema), createPost);
router.post("/upload", protect, upload.single("image"), uploadImage);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, likePost);
router.post("/:id/comment", protect, addComment);

export default router;
