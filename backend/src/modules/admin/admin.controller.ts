import { ParamsDictionary } from "express-serve-static-core";
import asyncHandler from "../../utils/asyncHandler.js";
import { HydratedDocument } from "mongoose";
import { Admin } from "./admin.model.js";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  getPendingDrivers,
  getDriverVerificationDetails,
  updateDriverVerification,
} from "./admin.service.js";

import {
  RegisterAdminInput,
  RegisterAdminResponse,
  AdminLoginInput,
  AdminLoginResponse,
  GetCurrentAdminResponse,
  GetPendingDriversResponse,
  GetDriverDetailsResponse,
  UpdateDriverVerificationInput,
  UpdateDriverVerificationResponse,
  LogoutAdminResponse,
} from "./admin.types.js";

type DriverIdParams = {
  driverId: string;
};

export const register = asyncHandler<
  ParamsDictionary,
  RegisterAdminResponse,
  RegisterAdminInput
>(async (req, res) => {
  const result = await registerAdmin(req.body, res);

  res.status(201).json(result);
});

export const login = asyncHandler<
  ParamsDictionary,
  AdminLoginResponse,
  AdminLoginInput
>(async (req, res) => {
  const result = await loginAdmin(req.body, res);

  res.status(200).json(result);
});

export const logout = asyncHandler<ParamsDictionary, LogoutAdminResponse>(
  async (req, res) => {
    res.clearCookie("token");
    const result = await logoutAdmin();

    res.status(200).json(result);
  },
);

export const me = asyncHandler<ParamsDictionary, GetCurrentAdminResponse>(
  async (req, res) => {
    const result = await getCurrentAdmin(
      req.account as HydratedDocument<Admin>,
    );

    res.status(200).json(result);
  },
);

export const getPendingDriversController = asyncHandler<
  ParamsDictionary,
  GetPendingDriversResponse
>(async (_req, res) => {
  const response = await getPendingDrivers();

  res.status(200).json(response);
});

export const getDriverVerificationDetailsController = asyncHandler<
  DriverIdParams,
  GetDriverDetailsResponse
>(async (req, res) => {
  const response = await getDriverVerificationDetails(req.params.driverId);

  res.status(200).json(response);
});

export const updateDriverVerificationController = asyncHandler<
  DriverIdParams,
  UpdateDriverVerificationResponse,
  UpdateDriverVerificationInput
>(async (req, res) => {
  const admin = req.account as HydratedDocument<Admin>;

  const response = await updateDriverVerification(
    req.params.driverId,
    admin._id.toString(),
    req.body,
  );

  res.status(200).json(response);
});
