import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import {
  getBusinessSettingsController,
  updateBusinessSettingsController,
} from "./businessSettings.controller.js";

const router = Router();

router.use(protectRoute);
router.use(adminOnly);

router.get("/", getBusinessSettingsController);
router.patch("/", updateBusinessSettingsController);

export default router;
