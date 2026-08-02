import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { HydratedDocument } from "mongoose";
import { User } from "../user/user.model.js";
import { Driver } from "../driver/driver.model.js";
import {
  createReview,
  getDriverReviews,
  getUserReviews,
  getDriverReviewSummary,
  getUserReviewSummary,
} from "./review.service.js";

export const createReviewController = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.accountType !== "User" && req.accountType !== "Driver") {
      throw new AppError("Invalid account type.", 403);
    }

    const result = await createReview(
      req.account as HydratedDocument<User> | HydratedDocument<Driver>,
      req.accountType,
      req.body,
    );

    res.status(201).json(result);
  },
);

export const getDriverReviewsController = asyncHandler(
  async (req: Request, res: Response) => {
    const driverId = req.params.driverId;

    if (typeof driverId !== "string") {
      throw new AppError("Invalid driver id.", 400);
    }

    const result = await getDriverReviews(driverId);

    res.json(result);
  },
);

export const getUserReviewsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;

    if (typeof userId !== "string") {
      throw new AppError("Invalid user id.", 400);
    }

    const result = await getUserReviews(userId);

    res.json(result);
  },
);

export const getDriverReviewSummaryController = asyncHandler(
  async (req: Request, res: Response) => {
    const driverId = req.params.driverId;

    if (typeof driverId !== "string") {
      throw new AppError("Invalid driver id.", 400);
    }

    const result = await getDriverReviewSummary(driverId);

    res.json(result);
  },
);

export const getUserReviewSummaryController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;

    if (typeof userId !== "string") {
      throw new AppError("Invalid user id.", 400);
    }

    const result = await getUserReviewSummary(userId);

    res.json(result);
  },
);
