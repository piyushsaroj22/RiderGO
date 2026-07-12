import { HydratedDocument } from "mongoose";
import { User } from "./user.model.js";
import AppError from "../../utils/AppError.js";
import { uploadImage, deleteImage } from "../../services/cloudinary.service.js";
import {
  GetUserProfileResponse,
  UpdateUserProfileInput,
  UpdateUserProfileResponse,
} from "./user.types.js";

export const getUserProfile = async (
  user: HydratedDocument<User>,
): Promise<GetUserProfileResponse> => {
  return {
    success: true,
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

export const updateUserProfile = async (
  user: HydratedDocument<User>,
  { name }: UpdateUserProfileInput,
): Promise<UpdateUserProfileResponse> => {
  // Validate name
  if (!name || !name.trim()) {
    throw new AppError("Name is required", 400);
  }

  if (name.trim().length > 100) {
    throw new AppError("Name cannot exceed 100 characters", 400);
  }

  // Update
  user.name = name.trim();

  await user.save();

  return {
    success: true,
    message: "Profile updated successfully",
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

export const uploadProfileImage = async (
  user: HydratedDocument<User>,
  file?: Express.Multer.File,
): Promise<UpdateUserProfileResponse> => {
  if (!file) {
    throw new AppError("Profile image is required", 400);
  }

  // Delete old image if exists
  if (user.profileImagePublicId) {
    await deleteImage(user.profileImagePublicId);
  }

  // Upload new image
  const uploadedImage = await uploadImage(
    file.buffer,
    "ridergo/profile-images",
  );

  // Save new image
  user.profileImage = uploadedImage.secureUrl;
  user.profileImagePublicId = uploadedImage.publicId;

  await user.save();

  return {
    success: true,
    message: "Profile image updated successfully",
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
    },
  };
};
