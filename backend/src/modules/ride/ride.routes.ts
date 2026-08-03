import { ensureDriverIsActive } from "../../middlewares/ensureDriverIsActive.middleware.js";
import { ensureUserIsActive } from "../../middlewares/ensureUserIsActive.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { Router } from "express";
import {
  create,
  driverRide,
  arrived,
  verifyOtp,
  accept,
  reject,
  start,
  complete,
  cancelByUser,
  cancelByDriver,
  userRideHistory,
  driverRideHistory,
  rideDetails,
} from "./ride.controller.js";

const router = Router();

router.use(protectRoute); // Apply protectRoute middleware to all routes

router.post("/", authorize(["User"]), ensureUserIsActive, create);

router.get("/driver", authorize(["Driver"]), driverRide);

router.patch(
  "/:rideId/arrived",
  authorize(["Driver"]),
  ensureDriverIsActive,
  arrived,
);

router.get(
  "/history",
  authorize(["User"]),
  ensureUserIsActive,
  userRideHistory,
);

router.get("/driver/history", authorize(["Driver"]), driverRideHistory);

router.get("/:rideId", authorize(["User", "Driver"]), rideDetails);

router.patch(
  "/:rideId/verify-otp",
  authorize(["Driver"]),
  ensureDriverIsActive,
  verifyOtp,
);

router.patch(
  "/:rideId/accept",
  authorize(["Driver"]),
  ensureDriverIsActive,
  accept,
);

router.patch(
  "/:rideId/reject",
  authorize(["Driver"]),
  ensureDriverIsActive,
  reject,
);

router.patch(
  "/:rideId/start",
  authorize(["Driver"]),
  ensureDriverIsActive,
  start,
);

router.patch(
  "/:rideId/complete",
  authorize(["Driver"]),
  ensureDriverIsActive,
  complete,
);

router.patch(
  "/:rideId/cancel",
  authorize(["User"]),
  ensureUserIsActive,
  cancelByUser,
);

router.patch(
  "/:rideId/driver-cancel",
  authorize(["Driver"]),
  ensureDriverIsActive,
  cancelByDriver,
);

export default router;
