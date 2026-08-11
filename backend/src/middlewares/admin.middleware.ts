import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

export const adminOnly = (req: Request, _res: Response, next: NextFunction) => {
  if (req.accountType !== "Admin") {
    throw new AppError("Admin access required.", 403);
  }

  next();
};
