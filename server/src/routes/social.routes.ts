import { Router } from "express";
import { getGitHubStats, getLeetCodeStats, getCodeforcesStats, followUser, unfollowUser, getNetwork, searchUsers } from "../controllers/social.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/github", protect, getGitHubStats);
router.get("/leetcode", protect, getLeetCodeStats);
router.get("/codeforces", protect, getCodeforcesStats);

router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);
router.get("/network/:id", protect, getNetwork);
router.get("/search", protect, searchUsers);

export default router;
