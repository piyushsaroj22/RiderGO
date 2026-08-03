import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import {
  register,
  login,
  logout,
  me,
  getPendingDriversController,
  getDriverVerificationDetailsController,
  updateDriverVerificationController,
  getDriversController,
  blockDriverController,
  unblockDriverController,
  getUsersController,
  blockUserController,
  unblockUserController,
} from "./admin.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protectRoute, authorize(["Admin"]), logout);
router.get("/me", protectRoute, authorize(["Admin"]), me);

router.get(
  "/drivers",
  protectRoute,
  authorize(["Admin"]),
  getDriversController,
);

router.get("/users", protectRoute, authorize(["Admin"]), getUsersController);

router.get(
  "/drivers/pending",
  protectRoute,
  authorize(["Admin"]),
  getPendingDriversController,
);

router.get(
  "/drivers/:driverId",
  protectRoute,
  authorize(["Admin"]),
  getDriverVerificationDetailsController,
);

router.patch(
  "/drivers/:driverId/verification",
  protectRoute,
  authorize(["Admin"]),
  updateDriverVerificationController,
);

router.patch(
  "/drivers/:driverId/block",
  protectRoute,
  authorize(["Admin"]),
  blockDriverController,
);

router.patch(
  "/drivers/:driverId/unblock",
  protectRoute,
  authorize(["Admin"]),
  unblockDriverController,
);

router.patch(
  "/users/:userId/block",
  protectRoute,
  authorize(["Admin"]),
  blockUserController,
);

router.patch(
  "/users/:userId/unblock",
  protectRoute,
  authorize(["Admin"]),
  unblockUserController,
);

export default router;
