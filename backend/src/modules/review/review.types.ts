import { Types } from "mongoose";

export interface Review {
  ride: Types.ObjectId;

  reviewer: Types.ObjectId;
  reviewerType: "User" | "Driver";

  reviewee: Types.ObjectId;
  revieweeType: "User" | "Driver";

  rating: number;
  comment?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewInput {
  rideId: string;
  rating: number;
  comment?: string;
}

export interface CreateReviewResponse {
  message: string;
}

export interface GetReviewsResponse {
  reviews: ReviewItem[];
}

export interface ReviewItem {
  id: string;
  reviewer: {
    id: string;
    type: "User" | "Driver";
    name: string;
    profileImage: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface GetReviewSummaryResponse {
  averageRating: number;
  totalRatings: number;
}
