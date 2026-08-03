import { Types } from "mongoose";

export interface Review {
  ride: Types.ObjectId;
  reviewer: Types.ObjectId;
  reviewerType: "User" | "Driver";
  reviewee: Types.ObjectId;
  revieweeType: "User" | "Driver";
  rating: number;
  comment?: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: Types.ObjectId | null;
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

export interface GetAdminReviewsQuery {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
  revieweeType?: "User" | "Driver";
  sortOrder?: "asc" | "desc";
}

export interface GetAdminReviewsQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  rating?: string;
  revieweeType?: "User" | "Driver";
  sortOrder?: "asc" | "desc";
}

export interface GetAdminReviewsResponse {
  success: boolean;

  data: {
    reviews: {
      id: string;
      rideId: string;
      reviewer: {
        id: string;
        name: string;
        type: "User" | "Driver";
      };
      reviewee: {
        id: string;
        name: string;
        type: "User" | "Driver";
      };
      rating: number;
      comment: string;
      createdAt: Date;
    }[];

    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ReviewIdParams {
  reviewId: string;
}

export interface GetReviewDetailsResponse {
  success: boolean;
  data: {
    id: string;
    rideId: string;
    reviewer: {
      id: string;
      name: string;
      email: string;
      type: "User" | "Driver";
    };
    reviewee: {
      id: string;
      name: string;
      email: string;
      type: "User" | "Driver";
    };
    rating: number;
    comment: string;
    createdAt: Date;
  };
}

export interface DeleteReviewInput {
  reviewId: string;
}

export interface DeleteReviewResponse {
  success: boolean;
  message: string;
}
