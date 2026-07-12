import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
} from "./user.controller.js";

const router = Router();

router.get("/profile", protectRoute, getProfile);
router.patch("/profile", protectRoute, updateProfile);

router.patch(
  "/profile-image",
  protectRoute,
  upload.single("profileImage"),
  updateProfileImage,
);

export default router;
