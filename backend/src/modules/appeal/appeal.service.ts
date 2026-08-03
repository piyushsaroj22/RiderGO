import { HydratedDocument } from "mongoose";
import AppError from "../../utils/AppError.js";
import DriverModel, { Driver } from "../driver/driver.model.js";
import AppealModel from "./appeal.model.js";
import { CreateAppealInput, CreateAppealResponse } from "./appeal.types.js";

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
  });

  return {
    success: true,
    message: "Appeal submitted successfully.",
  };
};
