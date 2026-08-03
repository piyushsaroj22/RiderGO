import { ensureUserIsActive } from "../../middlewares/ensureUserIsActive.middleware.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";
import { Router } from "express";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
} from "./user.controller.js";

const router = Router();

router.get("/profile", protectRoute, ensureUserIsActive, getProfile);

router.patch("/profile", protectRoute, ensureUserIsActive, updateProfile);

router.patch(
  "/profile-image",
  protectRoute,
  ensureUserIsActive,
  upload.single("profileImage"),
  updateProfileImage,
);

export default router;
