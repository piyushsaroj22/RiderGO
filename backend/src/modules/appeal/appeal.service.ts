import { Types, HydratedDocument } from "mongoose";
import AppError from "../../utils/AppError.js";
import AdminModel, { Admin } from "../admin/admin.model.js";
import DriverModel, { Driver } from "../driver/driver.model.js";
import AppealModel from "./appeal.model.js";
import {
  CreateAppealInput,
  CreateAppealResponse,
  GetAdminAppealsQuery,
  GetAdminAppealsResponse,
  ReviewAppealInput,
  ReviewAppealResponse,
} from "./appeal.types.js";

export const createAppeal = async (
  driver: HydratedDocument<Driver>,
  { reason }: CreateAppealInput,
): Promise<CreateAppealResponse> => {
  // Driver must be blocked
  if (!driver.isBlocked) {
    throw new AppError("Only blocked drivers can submit an appeal.", 400);
  }

  // Validate reason
  const appealReason = reason.trim();

  if (appealReason.length < 10) {
    throw new AppError(
      "Appeal reason must be at least 10 characters long.",
      400,
    );
  }

  // Check existing pending appeal
  const existingAppeal = await AppealModel.findOne({
    driver: driver._id,
    status: "PENDING",
  });

  if (existingAppeal) {
    throw new AppError("You already have a pending appeal.", 409);
  }

  // Create appeal
  await AppealModel.create({
    driver: driver._id,
    reason: appealReason,
    originalBlockReason: driver.blockReason,
    blockedAtSnapshot: driver.blockedAt,
  });

  return {
    success: true,
    message: "Appeal submitted successfully.",
  };
};

export const getAdminAppeals = async ({
  page = 1,
  limit = 20,
  status,
  search,
  sortOrder = "desc",
}: GetAdminAppealsQuery): Promise<GetAdminAppealsResponse> => {
  const filter: Record<string, unknown> = {};

  if (status) {
    filter.status = status;
  }

  if (search?.trim()) {
    const drivers = await DriverModel.find({
      $or: [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ],
    }).select("_id");

    filter.driver = {
      $in: drivers.map((driver) => driver._id),
    };
  }

  const skip = (page - 1) * limit;

  const [appeals, total] = await Promise.all([
    AppealModel.find(filter)
      .populate<{
        driver: Pick<Driver, "name" | "email" | "phone"> & {
          _id: Types.ObjectId;
        };
      }>("driver", "name email phone")
      .sort({
        createdAt: sortOrder === "asc" ? 1 : -1,
      })
      .skip(skip)
      .limit(limit),

    AppealModel.countDocuments(filter),
  ]);

  return {
    success: true,
    data: {
      appeals: appeals.map((appeal) => {
        return {
          id: appeal._id.toString(),
          driver: {
            id: appeal.driver._id.toString(),
            name: appeal.driver.name,
            email: appeal.driver.email,
            phone: appeal.driver.phone,
          },
          reason: appeal.reason,
          originalBlockReason: appeal.originalBlockReason,
          blockedAtSnapshot: appeal.blockedAtSnapshot ?? null,
          status: appeal.status,
          adminResponse: appeal.adminResponse,
          createdAt: appeal.createdAt,
          resolvedAt: appeal.resolvedAt ?? null,
        };
      }),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
};

export const reviewAppeal = async (
  appealId: string,
  admin: HydratedDocument<Admin>,
  payload: ReviewAppealInput,
): Promise<ReviewAppealResponse> => {
  if (!Types.ObjectId.isValid(appealId)) {
    throw new AppError("Invalid appeal ID.", 400);
  }

  const appeal = await AppealModel.findById(appealId);

  if (!appeal) {
    throw new AppError("Appeal not found.", 404);
  }

  if (appeal.status !== "PENDING") {
    throw new AppError("This appeal has already been reviewed.", 400);
  }

  const response = payload.response.trim();

  if (response.length < 10) {
    throw new AppError("Response must be at least 10 characters long.", 400);
  }

  const driver = await DriverModel.findById(appeal.driver);

  if (!driver) {
    throw new AppError("Driver not found.", 404);
  }

  appeal.status = payload.status;
  appeal.admin = admin._id;
  appeal.adminResponse = response;
  appeal.resolvedAt = new Date();

  if (payload.status === "APPROVED") {
    driver.isBlocked = false;
    driver.blockReason = "";
    driver.blockedAt = null;
    driver.blockedBy = null;

    await driver.save();
  }

  await appeal.save();

  return {
    success: true,
    message:
      payload.status === "APPROVED"
        ? "Appeal approved successfully."
        : "Appeal rejected successfully.",
  };
};
