import asyncHandler from "../../utils/asyncHandler.js";
import { HydratedDocument } from "mongoose";
import { User } from "./user.model.js";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
} from "./user.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const result = await getUserProfile(req.account as HydratedDocument<User>);

  res.status(200).json(result);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const result = await updateUserProfile(
    req.account as HydratedDocument<User>,
    req.body,
  );

  res.status(200).json(result);
});

export const updateProfileImage = asyncHandler(async (req, res) => {
  const result = await uploadProfileImage(
    req.account as HydratedDocument<User>,
    req.file,
  );

  res.status(200).json(result);
});
