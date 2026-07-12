import { Router } from "express";
import { register, verifyEmail, login, logout, me } from "./auth.controller.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protectRoute, me);

export default router;
