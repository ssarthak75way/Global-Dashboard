import express from "express";
import { signup, login, verifyOtp, refresh, logout, googleLogin, googleCallback, updateProfile, getMe, updateDashboardOrder, getUserActivity, getUserById } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { signupSchema, loginSchema, verifyOtpSchema, updateProfileSchema } from "../validations/schema";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/login", validate(loginSchema), login);
router.get("/refresh", refresh);
router.post("/logout", logout);
router.get("/google", googleLogin); 8
router.get("/google/callback", googleCallback);
router.get("/me", protect, getMe);
router.get("/user/:id", protect, getUserById);
router.get("/activity", protect, getUserActivity);
router.put("/dashboard-order", protect, updateDashboardOrder);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);

export default router;