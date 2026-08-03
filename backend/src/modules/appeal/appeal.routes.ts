import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { createAppealController } from "./appeal.controller.js";

const router = Router();

router.post("/", protectRoute, authorize(["Driver"]), createAppealController);

export default router;
