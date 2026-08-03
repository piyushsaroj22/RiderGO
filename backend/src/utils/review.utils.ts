import { Types } from "mongoose";

import DriverModel from "../modules/driver/driver.model.js";
import UserModel from "../modules/user/user.model.js";
import ReviewModel from "../modules/review/review.model.js";

export const recalculateRatings = async (
  revieweeId: Types.ObjectId,
  revieweeType: "User" | "Driver",
): Promise<void> => {
  const [stats] = await ReviewModel.aggregate([
    {
      $match: {
        reviewee: revieweeId,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: "$rating",
        },
        totalRatings: {
          $sum: 1,
        },
      },
    },
  ]);

  const averageRating = Number((stats?.averageRating ?? 0).toFixed(1));
  const totalRatings = stats?.totalRatings ?? 0;

  if (revieweeType === "Driver") {
    await DriverModel.findByIdAndUpdate(revieweeId, {
      averageRating,
      totalRatings,
    });
  } else {
    await UserModel.findByIdAndUpdate(revieweeId, {
      averageRating,
      totalRatings,
    });
  }
};
