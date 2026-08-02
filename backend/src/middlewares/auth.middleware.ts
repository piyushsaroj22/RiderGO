import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import UserModel from "../modules/user/user.model.js";
import DriverModel from "../modules/driver/driver.model.js";
import AdminModel from "../modules/admin/admin.model.js";
import type { UserDocument } from "../modules/user/user.model.js";
import type { DriverDocument } from "../modules/driver/driver.model.js";
import type { AdminDocument } from "../modules/admin/admin.model.js";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  const decoded = verifyToken(token);

  let account: UserDocument | DriverDocument | AdminDocument | null = null;

  switch (decoded.accountType) {
    case "User":
      account = await UserModel.findById(decoded.accountId);
      break;

    case "Driver":
      account = await DriverModel.findById(decoded.accountId);
      break;

    case "Admin":
      account = await AdminModel.findById(decoded.accountId);
      break;

    default:
      return next(new AppError("Invalid account type", 401));
  }

  if (!account) {
    return next(new AppError("Account not found", 404));
  }

  req.account = account;
  req.accountType = decoded.accountType;

  next();
};
