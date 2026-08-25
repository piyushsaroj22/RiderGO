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
  resetUserPassword,
  forgotPassword,
} from "./driver.service.js";

import { ParamsDictionary } from "express-serve-static-core";

import {
  RegisterDriverInput,
  RegisterDriverResponse,
  LoginDriverInput,
  LoginDriverResponse,
  GetCurrentDriverResponse,
  GetDriverProfileResponse,
  UpdateDriverProfileInput,
  UpdateDriverProfileResponse,
  UpdateDriverImageResponse,
  UpdateDriverLocationInput,
  UpdateDriverLocationResponse,
  ForgotPasswordResponse,
  ForgotPasswordInput,
  ResetPasswordInput,
  ResetPasswordResponse,
} from "./driver.types.js";

export const register = asyncHandler<
  ParamsDictionary,
  RegisterDriverResponse,
  RegisterDriverInput
>(async (req, res) => {
  const result = await registerDriver(req.body);

  res.status(201).json(result);
});

export const login = asyncHandler<
  ParamsDictionary,
  LoginDriverResponse,
  LoginDriverInput
>(async (req, res) => {
  const result = await loginDriver(req.body, res);

  res.status(200).json(result);
});

export const logout = asyncHandler<
  ParamsDictionary,
  { success: boolean; message: string }
>(async (req, res) => {
  res.clearCookie("token");

  const result = logoutDriver();

  res.status(200).json(result);
});

export const me = asyncHandler<ParamsDictionary, GetCurrentDriverResponse>(
  async (req, res) => {
    const result = await getCurrentDriver(
      req.account as HydratedDocument<Driver>,
    );

    res.status(200).json(result);
  },
);

export const getProfile = asyncHandler<
  ParamsDictionary,
  GetDriverProfileResponse
>(async (req, res) => {
  const result = await getDriverProfile(
    req.account as HydratedDocument<Driver>,
  );

  res.status(200).json(result);
});

export const updateProfile = asyncHandler<
  ParamsDictionary,
  UpdateDriverProfileResponse,
  UpdateDriverProfileInput
>(async (req, res) => {
  const result = await updateDriverProfile(
    req.account as HydratedDocument<Driver>,
    req.body,
  );

  res.status(200).json(result);
});

export const updateProfileImage = asyncHandler<
  ParamsDictionary,
  UpdateDriverImageResponse
>(async (req, res) => {
  const result = await updateDriverProfileImage(
    req.account as HydratedDocument<Driver>,
    req.file,
  );

  res.status(200).json(result);
});

export const updateLicenseImage = asyncHandler<
  ParamsDictionary,
  UpdateDriverImageResponse
>(async (req, res) => {
  const result = await updateDriverLicenseImage(
    req.account as HydratedDocument<Driver>,
    req.file,
  );

  res.status(200).json(result);
});

export const updateRcImage = asyncHandler<
  ParamsDictionary,
  UpdateDriverImageResponse
>(async (req, res) => {
  const result = await updateDriverRcImage(
    req.account as HydratedDocument<Driver>,
    req.file,
  );

  res.status(200).json(result);
});

export const updateVehicleImage = asyncHandler<
  ParamsDictionary,
  UpdateDriverImageResponse
>(async (req, res) => {
  const result = await updateDriverVehicleImage(
    req.account as HydratedDocument<Driver>,
    req.file,
  );

  res.status(200).json(result);
});

export const updateLocation = asyncHandler<
  ParamsDictionary,
  UpdateDriverLocationResponse,
  UpdateDriverLocationInput
>(async (req, res) => {
  const result = await updateDriverLocation(
    req.account as HydratedDocument<Driver>,
    req.body,
  );

  res.status(200).json(result);
});

type PasswordResetParams = {
  token: string;
  accountType: string;
};

export const forgotPasswordController = asyncHandler<
  ParamsDictionary,
  ForgotPasswordResponse,
  ForgotPasswordInput
>(async (req, res) => {
  const result = await forgotPassword(req.body.email, "Driver");

  res.status(200).json(result);
});

export const resetPasswordController = asyncHandler<
  PasswordResetParams,
  ResetPasswordResponse,
  ResetPasswordInput
>(async (req, res) => {
  const result = await resetUserPassword(
    req.params.token,
    req.body.password,
    "Driver",
  );

  res.status(200).json(result);
});
