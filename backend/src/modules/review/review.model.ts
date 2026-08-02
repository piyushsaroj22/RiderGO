import { Schema, model } from "mongoose";
import { Review } from "./review.types.js";

const reviewSchema = new Schema<Review>(
  {
    ride: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },

    reviewer: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "reviewerType",
    },

    reviewerType: {
      type: String,
      enum: ["User", "Driver"],
      required: true,
    },

    reviewee: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "revieweeType",
    },

    revieweeType: {
      type: String,
      enum: ["User", "Driver"],
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index(
  {
    ride: 1,
    reviewer: 1,
  },
  {
    unique: true,
  },
);

reviewSchema.index({
  reviewee: 1,
  createdAt: -1,
});

const ReviewModel = model<Review>("Review", reviewSchema);

export default ReviewModel;
