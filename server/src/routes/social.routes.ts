import { Router } from "express";
import { getGitHubStats, getLeetCodeStats, getCodeforcesStats } from "../controllers/social.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/github", protect, getGitHubStats);
router.get("/leetcode", protect, getLeetCodeStats);
router.get("/codeforces", protect, getCodeforcesStats);

export default router;
