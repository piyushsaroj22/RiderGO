import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import UserModel from "../modules/user/user.model.js";

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

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  req.user = user;

  next();
};
