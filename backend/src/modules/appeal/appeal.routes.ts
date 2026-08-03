import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import {
  createAppealController,
  getAdminAppealsController,
  reviewAppealController,
} from "./appeal.controller.js";

const router = Router();

router.post("/", protectRoute, authorize(["Driver"]), createAppealController);

router.get(
  "/admin",
  protectRoute,
  authorize(["Admin"]),
  getAdminAppealsController,
);

router.patch(
  "/admin/:appealId",
  protectRoute,
  authorize(["Admin"]),
  reviewAppealController,
);

export default router;
