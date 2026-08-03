import { ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { HydratedDocument } from "mongoose";
import { User } from "../user/user.model.js";
import { Driver } from "../driver/driver.model.js";
import { Admin } from "../admin/admin.model.js";

import {
  createReview,
  getDriverReviews,
  getUserReviews,
  getDriverReviewSummary,
  getUserReviewSummary,
  getAdminReviews,
  getReviewDetails,
  deleteReview,
} from "./review.service.js";

import {
  GetAdminReviewsQuery,
  GetAdminReviewsQueryParams,
  GetAdminReviewsResponse,
  GetReviewDetailsResponse,
  DeleteReviewResponse,
} from "./review.types.js";

type ReviewIdParams = {
  reviewId: string;
};

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

export const getAdminReviewsController = asyncHandler<
  ParamsDictionary,
  GetAdminReviewsResponse,
  never,
  GetAdminReviewsQueryParams
>(async (req, res) => {
  const query: GetAdminReviewsQuery = {
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 20,

    search: typeof req.query.search === "string" ? req.query.search : undefined,

    rating: req.query.rating ? Number(req.query.rating) : undefined,

    revieweeType:
      req.query.revieweeType === "Driver" || req.query.revieweeType === "User"
        ? req.query.revieweeType
        : undefined,

    sortOrder:
      req.query.sortOrder === "asc" || req.query.sortOrder === "desc"
        ? req.query.sortOrder
        : "desc",
  };

  const result = await getAdminReviews(query);

  res.status(200).json(result);
});

export const getReviewDetailsController = asyncHandler<
  ReviewIdParams,
  GetReviewDetailsResponse
>(async (req, res) => {
  const result = await getReviewDetails(req.params.reviewId);

  res.status(200).json(result);
});

export const deleteReviewController = asyncHandler<
  ReviewIdParams,
  DeleteReviewResponse
>(async (req, res) => {
  const admin = req.account as HydratedDocument<Admin>;

  const result = await deleteReview(req.params.reviewId, admin);

  res.status(200).json(result);
});
