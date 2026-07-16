import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
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

router.post("/", protectRoute, authorize("User"), create);
router.get("/driver", protectRoute, authorize("Driver"), driverRide);
router.patch("/:rideId/arrived", protectRoute, authorize("Driver"), arrived);

router.get("/history", protectRoute, authorize("User"), userRideHistory);

router.get(
  "/driver/history",
  protectRoute,
  authorize("Driver"),
  driverRideHistory,
);

router.get("/:rideId", protectRoute, authorize("User", "Driver"), rideDetails);

router.patch(
  "/:rideId/verify-otp",
  protectRoute,
  authorize("Driver"),
  verifyOtp,
);

router.patch("/:rideId/accept", protectRoute, authorize("Driver"), accept);
router.patch("/:rideId/reject", protectRoute, authorize("Driver"), reject);
router.patch("/:rideId/start", protectRoute, authorize("Driver"), start);
router.patch("/:rideId/complete", protectRoute, authorize("Driver"), complete);
router.patch("/:rideId/cancel", protectRoute, authorize("User"), cancelByUser);

router.patch(
  "/:rideId/driver-cancel",
  protectRoute,
  authorize("Driver"),
  cancelByDriver,
);

export default router;
