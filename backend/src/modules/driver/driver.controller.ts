import asyncHandler from "../../utils/asyncHandler.js";
import { HydratedDocument } from "mongoose";
import { Driver } from "./driver.model.js";
import {
  registerDriver,
  loginDriver,
  logoutDriver,
  getCurrentDriver,
  getDriverProfile,
  updateDriverProfile,
  updateDriverProfileImage,
  updateDriverLicenseImage,
  updateDriverRcImage,
  updateDriverVehicleImage,
  updateDriverLocation,
} from "./driver.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerDriver(req.body);

  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginDriver(req.body, res);

  res.status(200).json(result);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");

  const result = logoutDriver();

  res.status(200).json(result);
});

export const me = asyncHandler(async (req, res) => {
  const result = await getCurrentDriver(
    req.account as HydratedDocument<Driver>,
  );

  res.status(200).json(result);
});

export const getProfile = asyncHandler(async (req, res) => {
  const result = await getDriverProfile(
    req.account as HydratedDocument<Driver>,
  );

  res.status(200).json(result);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const result = await updateDriverProfile(
    req.account as HydratedDocument<Driver>,
    req.body,
  );

  res.status(200).json(result);
});

export const updateProfileImage = asyncHandler(async (req, res) => {
  const result = await updateDriverProfileImage(
    req.account as HydratedDocument<Driver>,
    req.file,
  );

  res.status(200).json(result);
});

export const updateLicenseImage = asyncHandler(async (req, res) => {
  const result = await updateDriverLicenseImage(
    req.account as HydratedDocument<Driver>,
    req.file,
  );

  res.status(200).json(result);
});

export const updateRcImage = asyncHandler(async (req, res) => {
  const result = await updateDriverRcImage(
    req.account as HydratedDocument<Driver>,
    req.file,
  );

  res.status(200).json(result);
});

export const updateVehicleImage = asyncHandler(async (req, res) => {
  const result = await updateDriverVehicleImage(
    req.account as HydratedDocument<Driver>,
    req.file,
  );

  res.status(200).json(result);
});

export const updateLocation = asyncHandler(async (req, res) => {
  const result = await updateDriverLocation(
    req.account as HydratedDocument<Driver>,
    req.body,
  );

  res.status(200).json(result);
});
