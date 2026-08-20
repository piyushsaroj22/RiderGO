import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import {
  createPaymentController,
  verifyPaymentController,
} from "./payment.controller.js";

const router = Router();

router.post("/", protectRoute, createPaymentController);
router.post("/verify", protectRoute, verifyPaymentController);

export default router;
