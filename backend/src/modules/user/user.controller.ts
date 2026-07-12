import asyncHandler from "../../utils/asyncHandler.js";
import { getUserProfile, updateUserProfile } from "./user.service.js";
import { uploadProfileImage } from "./user.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const result = await getUserProfile(req.user!);

  res.status(200).json(result);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const result = await updateUserProfile(req.user!, req.body);

  res.status(200).json(result);
});

export const updateProfileImage = asyncHandler(async (req, res) => {
  const result = await uploadProfileImage(req.user!, req.file);

  res.status(200).json(result);
});
