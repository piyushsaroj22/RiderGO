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

router.use(protectRoute); // Apply protectRoute middleware to all routes

router.post("/", authorize(["User"]), create);

router.get("/driver", authorize(["Driver"]), driverRide);

router.patch("/:rideId/arrived", authorize(["Driver"]), arrived);

router.get("/history", authorize(["User"]), userRideHistory);

router.get("/driver/history", authorize(["Driver"]), driverRideHistory);

router.get("/:rideId", authorize(["User", "Driver"]), rideDetails);

router.patch("/:rideId/verify-otp", authorize(["Driver"]), verifyOtp);

router.patch("/:rideId/accept", authorize(["Driver"]), accept);

router.patch("/:rideId/reject", authorize(["Driver"]), reject);

router.patch("/:rideId/start", authorize(["Driver"]), start);

router.patch("/:rideId/complete", authorize(["Driver"]), complete);

router.patch("/:rideId/cancel", authorize(["User"]), cancelByUser);

router.patch("/:rideId/driver-cancel", authorize(["Driver"]), cancelByDriver);

export default router;
