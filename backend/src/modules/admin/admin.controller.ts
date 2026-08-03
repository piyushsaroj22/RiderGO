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
  getDrivers,
  updateDriverBlockStatus,
  getUsers,
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
  GetDriversQuery,
  GetDriversQueryParams,
  GetDriversResponse,
  // DriverIdParams,
  UpdateDriverBlockStatusResponse,
  BlockDriverInput,
  GetUsersQueryParams,
  GetUsersQuery,
  GetUsersResponse,
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

export const getDriversController = asyncHandler<
  ParamsDictionary,
  GetDriversResponse,
  never,
  GetDriversQueryParams
>(async (req, res) => {
  const queryParams: GetDriversQueryParams = req.query;

  const query: GetDriversQuery = {
    page: queryParams.page ? Number(queryParams.page) : 1,
    limit: queryParams.limit ? Number(queryParams.limit) : 20,
    search: queryParams.search,
    verificationStatus: queryParams.verificationStatus,
    isBlocked:
      queryParams.isBlocked === "true"
        ? true
        : queryParams.isBlocked === "false"
          ? false
          : undefined,

    vehicleType: queryParams.vehicleType,
    sortBy: queryParams.sortBy ?? "createdAt",
    sortOrder: queryParams.sortOrder ?? "desc",
  };

  const result = await getDrivers(query);

  res.status(200).json(result);
});

export const getUsersController = asyncHandler<
  ParamsDictionary,
  GetUsersResponse,
  unknown,
  GetUsersQueryParams
>(async (req, res) => {
  const query: GetUsersQuery = {
    page: req.query.page ? Number(req.query.page) : 1,

    limit: req.query.limit ? Number(req.query.limit) : 20,

    search: typeof req.query.search === "string" ? req.query.search : undefined,

    isBlocked:
      req.query.isBlocked === "true"
        ? true
        : req.query.isBlocked === "false"
          ? false
          : undefined,

    sortBy:
      req.query.sortBy === "name" ||
      req.query.sortBy === "email" ||
      req.query.sortBy === "createdAt" ||
      req.query.sortBy === "averageRating" ||
      req.query.sortBy === "totalRatings"
        ? req.query.sortBy
        : "createdAt",

    sortOrder:
      req.query.sortOrder === "asc" || req.query.sortOrder === "desc"
        ? req.query.sortOrder
        : "desc",
  };

  const result = await getUsers(query);

  res.status(200).json(result);
});

export const blockDriverController = asyncHandler<
  DriverIdParams,
  UpdateDriverBlockStatusResponse,
  BlockDriverInput
>(async (req, res) => {
  const admin = req.account as HydratedDocument<Admin>;

  const result = await updateDriverBlockStatus(
    req.params.driverId,
    admin._id.toString(),
    true,
    req.body,
  );

  res.status(200).json(result);
});

export const unblockDriverController = asyncHandler<
  DriverIdParams,
  UpdateDriverBlockStatusResponse
>(async (req, res) => {
  const admin = req.account as HydratedDocument<Admin>;

  const result = await updateDriverBlockStatus(
    req.params.driverId,
    admin._id.toString(),
    false,
  );

  res.status(200).json(result);
});
