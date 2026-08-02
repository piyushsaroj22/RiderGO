import { HydratedDocument } from "mongoose";
import { Admin } from "../modules/admin/admin.model.js";
import { NextFunction, Request, Response } from "express";

import AppError from "../utils/AppError.js";

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.accountType !== "Admin") {
    return next(new AppError("Unauthorized", 401));
  }

  const admin = req.account as HydratedDocument<Admin>;

  if (admin.role !== "SUPER_ADMIN") {
    return next(new AppError("Only super admin can perform this action", 403));
  }

  next();
};
