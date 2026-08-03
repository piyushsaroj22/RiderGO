import { NextFunction, Request, Response } from "express";
import DriverModel from "../modules/driver/driver.model.js";
import AppError from "../utils/AppError.js";

export const ensureDriverIsActive = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.accountType !== "Driver") {
    return next();
  }

  const driver = await DriverModel.findById(req.account._id).select(
    "isBlocked",
  );

  if (!driver) {
    throw new AppError("Driver not found.", 404);
  }

  if (driver.isBlocked) {
    throw new AppError(
      "Your account has been suspended. Please contact support.",
      403,
    );
  }

  next();
};
