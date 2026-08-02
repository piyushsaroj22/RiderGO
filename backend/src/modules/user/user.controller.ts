import { ParamsDictionary } from "express-serve-static-core";
import asyncHandler from "../../utils/asyncHandler.js";
import { HydratedDocument } from "mongoose";
import { User } from "./user.model.js";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
} from "./user.service.js";
import {
  GetUserProfileResponse,
  UpdateUserProfileInput,
  UpdateUserProfileResponse,
} from "./user.types.js";

export const getProfile = asyncHandler<
  ParamsDictionary,
  GetUserProfileResponse // yaha un donon ki koi jarurat nahi thi lekin thik hai
>(async (req, res) => {
  const result = await getUserProfile(req.account as HydratedDocument<User>);

  res.status(200).json(result);
});

export const updateProfile = asyncHandler<
  ParamsDictionary,
  UpdateUserProfileResponse,
  UpdateUserProfileInput
>(async (req, res) => {
  const result = await updateUserProfile(
    req.account as HydratedDocument<User>,
    req.body,
  );

  res.status(200).json(result);
});

export const updateProfileImage = asyncHandler<
  ParamsDictionary,
  UpdateUserProfileResponse
>(async (req, res) => {
  const result = await uploadProfileImage(
    req.account as HydratedDocument<User>,
    req.file,
  );

  res.status(200).json(result);
});
