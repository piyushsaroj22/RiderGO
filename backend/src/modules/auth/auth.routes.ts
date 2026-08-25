import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import {
  register,
  verifyEmail,
  login,
  logout,
  me,
  forgotPasswordController,
  resetPasswordController,
} from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, me);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);

export default router;
