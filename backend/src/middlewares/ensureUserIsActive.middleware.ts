import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import UserModel from "../modules/user/user.model.js";

export const ensureUserIsActive = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (req.accountType !== "User") {
    return next();
  }

  const user = await UserModel.findById(req.account?._id).select(
    "isBlocked blockReason",
  );

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (user.isBlocked) {
    throw new AppError(
      user.blockReason || "Your account has been blocked.",
      403,
    );
  }

  next();
};
