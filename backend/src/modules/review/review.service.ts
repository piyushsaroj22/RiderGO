import { HydratedDocument, Types } from "mongoose";
import AppError from "../../utils/AppError.js";
import RideModel from "../ride/ride.model.js";
import ReviewModel from "./review.model.js";
import { Admin } from "../admin/admin.model.js";
import UserModel, { User } from "../user/user.model.js";
import DriverModel, { Driver } from "../driver/driver.model.js";
import { recalculateRatings } from "../../utils/review.utils.js";

import {
  CreateReviewInput,
  CreateReviewResponse,
  GetReviewsResponse,
  GetReviewSummaryResponse,
  ReviewItem,
  GetAdminReviewsQuery,
  GetAdminReviewsResponse,
  GetReviewDetailsResponse,
  ReviewIdParams,
  DeleteReviewResponse,
} from "./review.types.js";

const mapReviewToDto = (review: {
  _id: Types.ObjectId;
  reviewer: {
    _id: Types.ObjectId;
    name: string;
    profileImage: string;
  };
  reviewerType: "User" | "Driver";
  rating: number;
  comment?: string;
  createdAt: Date;
}): ReviewItem => ({
  id: review._id.toString(),
  reviewer: {
    id: review.reviewer._id.toString(),
    type: review.reviewerType,
    name: review.reviewer.name,
    profileImage: review.reviewer.profileImage,
  },
  rating: review.rating,
  comment: review.comment ?? "",
  createdAt: review.createdAt,
});

export const createReview = async (
  reviewer: HydratedDocument<User> | HydratedDocument<Driver>,
  accountType: "User" | "Driver",
  { rideId, rating, comment }: CreateReviewInput,
): Promise<CreateReviewResponse> => {
  // Validate rating
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5.", 400);
  }

  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new AppError("Ride not found.", 404);
  }

  if (ride.status !== "COMPLETED") {
    throw new AppError("You can only review completed rides.", 400);
  }

  if (
    accountType === "User" &&
    ride.rider.toString() !== reviewer._id.toString()
  ) {
    throw new AppError("You are not allowed to review this ride.", 403);
  }

  if (
    accountType === "Driver" &&
    ride.driver?.toString() !== reviewer._id.toString()
  ) {
    throw new AppError("You are not allowed to review this ride.", 403);
  }

  const existingReview = await ReviewModel.findOne({
    ride: ride._id,
    reviewer: reviewer._id,
    isDeleted: false,
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this ride.", 409);
  }

  const reviewee = accountType === "User" ? ride.driver : ride.rider;

  const revieweeType = accountType === "User" ? "Driver" : "User";

  if (!reviewee) {
    throw new AppError("Review recipient not found.", 404);
  }

  await ReviewModel.create({
    ride: ride._id,
    reviewer: reviewer._id,
    reviewerType: accountType,
    reviewee,
    revieweeType,
    rating,
    comment,
  });

  await recalculateRatings(reviewee as Types.ObjectId, revieweeType);

  return {
    message: "Review submitted successfully",
  };
};

export const getDriverReviews = async (
  driverId: string,
): Promise<GetReviewsResponse> => {
  const reviews = await ReviewModel.find({
    reviewee: driverId,
    revieweeType: "Driver",
    isDeleted: false,
  })
    .populate<{
      reviewer: {
        _id: Types.ObjectId;
        name: string;
        profileImage: string;
      };
    }>("reviewer", "name profileImage")
    .sort({ createdAt: -1 });

  return {
    reviews: reviews.map(mapReviewToDto),
  };
};

export const getUserReviews = async (
  userId: string,
): Promise<GetReviewsResponse> => {
  const reviews = await ReviewModel.find({
    reviewee: userId,
    revieweeType: "User",
    isDeleted: false,
  })
    .populate<{
      reviewer: {
        _id: Types.ObjectId;
        name: string;
        profileImage: string;
      };
    }>("reviewer", "name profileImage")
    .sort({ createdAt: -1 });

  return {
    reviews: reviews.map(mapReviewToDto),
  };
};

export const getDriverReviewSummary = async (
  driverId: string,
): Promise<GetReviewSummaryResponse> => {
  const driver = await DriverModel.findById(driverId).select(
    "averageRating totalRatings",
  );

  if (!driver) {
    throw new AppError("Driver not found.", 404);
  }

  return {
    averageRating: driver.averageRating,
    totalRatings: driver.totalRatings,
  };
};

export const getUserReviewSummary = async (
  userId: string,
): Promise<GetReviewSummaryResponse> => {
  const user = await UserModel.findById(userId).select(
    "averageRating totalRatings",
  );

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return {
    averageRating: user.averageRating,
    totalRatings: user.totalRatings,
  };
};

export const getAdminReviews = async ({
  page = 1,
  limit = 20,
  search,
  rating,
  revieweeType,
  sortOrder = "desc",
}: GetAdminReviewsQuery): Promise<GetAdminReviewsResponse> => {
  const filter: Record<string, unknown> = {
    isDeleted: false,
  };

  if (revieweeType) {
    filter.revieweeType = revieweeType;
  }

  if (rating) {
    filter.rating = rating;
  }

  if (search?.trim()) {
    const keyword = search.trim();

    const users = await UserModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    }).select("_id");

    const drivers = await DriverModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ],
    }).select("_id");

    filter.$or = [
      {
        reviewer: {
          $in: [...users.map((u) => u._id), ...drivers.map((d) => d._id)],
        },
      },
      {
        reviewee: {
          $in: [...users.map((u) => u._id), ...drivers.map((d) => d._id)],
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    ReviewModel.find(filter)
      .populate<{
        reviewer: {
          _id: Types.ObjectId;
          name: string;
        };
      }>("reviewer", "name")
      .populate<{
        reviewee: {
          _id: Types.ObjectId;
          name: string;
        };
      }>("reviewee", "name")
      .sort({
        createdAt: sortOrder === "asc" ? 1 : -1,
      })
      .skip(skip)
      .limit(limit),

    ReviewModel.countDocuments(filter),
  ]);

  return {
    success: true,
    data: {
      reviews: reviews.map((review) => ({
        id: review._id.toString(),
        rideId: review.ride.toString(),
        reviewer: {
          id: review.reviewer._id.toString(),
          name: review.reviewer.name,
          type: review.reviewerType,
        },
        reviewee: {
          id: review.reviewee._id.toString(),
          name: review.reviewee.name,
          type: review.revieweeType,
        },
        rating: review.rating,
        comment: review.comment ?? "",
        createdAt: review.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
};

export const getReviewDetails = async (
  reviewId: string,
): Promise<GetReviewDetailsResponse> => {
  if (!Types.ObjectId.isValid(reviewId)) {
    throw new AppError("Invalid review ID.", 400);
  }

  const review = await ReviewModel.findOne({
    _id: reviewId,
    isDeleted: false,
  })
    .populate<{
      reviewer: {
        _id: Types.ObjectId;
        name: string;
        email: string;
      };
    }>("reviewer", "name email")
    .populate<{
      reviewee: {
        _id: Types.ObjectId;
        name: string;
        email: string;
      };
    }>("reviewee", "name email");

  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  return {
    success: true,
    data: {
      id: review._id.toString(),
      rideId: review.ride.toString(),
      reviewer: {
        id: review.reviewer._id.toString(),
        name: review.reviewer.name,
        email: review.reviewer.email,
        type: review.reviewerType,
      },
      reviewee: {
        id: review.reviewee._id.toString(),
        name: review.reviewee.name,
        email: review.reviewee.email,
        type: review.revieweeType,
      },
      rating: review.rating,
      comment: review.comment ?? "",
      createdAt: review.createdAt,
    },
  };
};

export const deleteReview = async (
  reviewId: string,
  admin: HydratedDocument<Admin>,
): Promise<DeleteReviewResponse> => {
  if (!Types.ObjectId.isValid(reviewId)) {
    throw new AppError("Invalid review ID.", 400);
  }

  const review = await ReviewModel.findById(reviewId);

  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  if (review.isDeleted) {
    throw new AppError("Review has already been deleted.", 400);
  }

  review.isDeleted = true;
  review.deletedAt = new Date();
  review.deletedBy = admin._id;

  await review.save();

  await recalculateRatings(
    review.reviewee as Types.ObjectId,
    review.revieweeType,
  );

  return {
    success: true,
    message: "Review deleted successfully.",
  };
};
