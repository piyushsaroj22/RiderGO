import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";

import AppError from "../utils/AppError.js";
import { AccountType } from "../utils/jwt.js";
import { Admin } from "../modules/admin/admin.model.js";

export const authorize =
  (
    allowedAccountTypes: AccountType[],
    allowedAdminRoles?: ("SUPER_ADMIN" | "ADMIN")[],
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.account || !req.accountType) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!allowedAccountTypes.includes(req.accountType)) {
      return next(new AppError("Forbidden", 403));
    }

    if (
      req.accountType === "Admin" &&
      allowedAdminRoles &&
      allowedAdminRoles.length > 0
    ) {
      const admin = req.account as HydratedDocument<Admin>;

      if (!allowedAdminRoles.includes(admin.role)) {
        return next(new AppError("Forbidden", 403));
      }
    }

    next();
  };
