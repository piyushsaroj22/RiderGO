import { Router } from "express";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";
import {
  register,
  login,
  logout,
  me,
  getProfile,
  updateProfile,
  updateProfileImage,
  updateLicenseImage,
  updateRcImage,
  updateVehicleImage,
  updateLocation,
} from "./driver.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protectRoute, authorize("Driver"), logout);
router.get("/me", protectRoute, authorize("Driver"), me);
router.get("/profile", protectRoute, authorize("Driver"), getProfile);
router.patch("/profile", protectRoute, authorize("Driver"), updateProfile);
router.patch("/location", protectRoute, authorize("Driver"), updateLocation);
router.patch(
  "/profile-image",
  protectRoute,
  authorize("Driver"),
  upload.single("profileImage"),
  updateProfileImage,
);

router.patch(
  "/license-image",
  protectRoute,
  authorize("Driver"),
  upload.single("licenseImage"),
  updateLicenseImage,
);

router.patch(
  "/rc-image",
  protectRoute,
  authorize("Driver"),
  upload.single("rcImage"),
  updateRcImage,
);

router.patch(
  "/vehicle-image",
  protectRoute,
  authorize("Driver"),
  upload.single("vehicleImage"),
  updateVehicleImage,
);

export default router;
