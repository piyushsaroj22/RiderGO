import bcrypt from "bcrypt";
import { Response } from "express";
import { HydratedDocument } from "mongoose";
import { Driver } from "./driver.model.js";
import DriverModel from "./driver.model.js";
import AppError from "../../utils/AppError.js";
import { generateToken } from "../../utils/jwt.js";
import { setAuthCookie } from "../../utils/cookie.js";
import { UpdateDriverImageResponse } from "./driver.types.js";
// import { uploadImage, deleteImage } from "../../services/cloudinary.service.js";
import { RegisterDriverInput, RegisterDriverResponse } from "./driver.types.js";
import { sendVerificationEmail } from "../emailVerification/emailVerification.service.js";
import { updateDriverImage } from "./driver.image.service.js";
import {
  GetCurrentDriverResponse,
  LoginDriverInput,
  LoginDriverResponse,
  GetDriverProfileResponse,
  UpdateDriverProfileInput,
  UpdateDriverProfileResponse,
  UpdateDriverLocationInput,
  UpdateDriverLocationResponse,
} from "./driver.types.js";

export const registerDriver = async ({
  name,
  email,
  password,
  phone,
  vehicleType,
}: RegisterDriverInput): Promise<RegisterDriverResponse> => {
  // Validate required fields
  if (!name || !email || !password || !phone || !vehicleType) {
    throw new AppError("All fields are required", 400);
  }

  // Check duplicate email
  const existingDriver = await DriverModel.findOne({ email });

  if (existingDriver) {
    throw new AppError("Email already exists", 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create driver
  const driver = await DriverModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    vehicleType,
  });

  // Send verification email
  await sendVerificationEmail(
    driver._id.toString(),
    "Driver",
    driver.name,
    driver.email,
  );

  return {
    success: true,
    message: "Registration successful. Please verify your email.",
    data: {
      id: driver._id.toString(),
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      vehicleType: driver.vehicleType,
    },
  };
};

export const loginDriver = async (
  { email, password }: LoginDriverInput,
  res: Response,
): Promise<LoginDriverResponse> => {
  // Validate required fields
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // Find driver
  const driver = await DriverModel.findOne({ email });

  if (!driver) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, driver.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // Email verification check
  if (!driver.isEmailVerified) {
    throw new AppError("Please verify your email first", 403);
  }

  // Approval check
  if (!driver.isApproved) {
    throw new AppError("Your account is under review", 403);
  }

  // Generate JWT
  const jwtToken = generateToken(driver._id.toString(), "Driver");

  // Set cookie
  setAuthCookie(res, jwtToken);

  return {
    success: true,
    message: "Login successful",
    data: {
      id: driver._id.toString(),
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      vehicleType: driver.vehicleType,
      profileImage: driver.profileImage,
      isEmailVerified: driver.isEmailVerified,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    },
  };
};

export const logoutDriver = () => {
  return {
    success: true,
    message: "Logout successful",
  };
};

export const getCurrentDriver = async (
  driver: HydratedDocument<Driver>,
): Promise<GetCurrentDriverResponse> => {
  return {
    success: true,
    data: {
      id: driver._id.toString(),
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      vehicleType: driver.vehicleType,
      profileImage: driver.profileImage,
      isEmailVerified: driver.isEmailVerified,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    },
  };
};

export const getDriverProfile = async (
  driver: HydratedDocument<Driver>,
): Promise<GetDriverProfileResponse> => {
  return {
    success: true,
    data: {
      id: driver._id.toString(),
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      vehicleType: driver.vehicleType,
      profileImage: driver.profileImage,
      isEmailVerified: driver.isEmailVerified,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    },
  };
};

export const updateDriverProfile = async (
  driver: HydratedDocument<Driver>,
  { name, phone }: UpdateDriverProfileInput,
): Promise<UpdateDriverProfileResponse> => {
  if (!name || !name?.trim()) {
    throw new AppError("Name is required", 400);
  }

  if (!phone || !phone?.trim()) {
    throw new AppError("Phone Number is required", 400);
  }

  if (name.trim().length > 100) {
    throw new AppError("Name cannot exceed 100 characters", 400);
  }

  driver.name = name.trim();
  driver.phone = phone.trim();

  await driver.save();

  return {
    success: true,
    message: "Profile updated successfully",
    data: {
      id: driver._id.toString(),
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      vehicleType: driver.vehicleType,
      profileImage: driver.profileImage,
      isEmailVerified: driver.isEmailVerified,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    },
  };
};

// helper function to build the response for image update
const buildDriverImageResponse = (
  driver: HydratedDocument<Driver>,
  message: string,
): UpdateDriverImageResponse => ({
  success: true,
  message,
  data: {
    id: driver._id.toString(),
    name: driver.name,
    email: driver.email,
    phone: driver.phone,
    vehicleType: driver.vehicleType,
    profileImage: driver.profileImage,
    licenseImage: driver.licenseImage,
    rcImage: driver.rcImage,
    vehicleImage: driver.vehicleImage,
    isEmailVerified: driver.isEmailVerified,
    isApproved: driver.isApproved,
    isOnline: driver.isOnline,
  },
});

export const updateDriverProfileImage = async (
  driver: HydratedDocument<Driver>,
  file?: Express.Multer.File,
): Promise<UpdateDriverImageResponse> => {
  if (!file) {
    throw new AppError("Profile image is required", 400);
  }

  await updateDriverImage({
    driver,
    file,
    folder: "ridergo/drivers/profile-images",
    imageField: "profileImage",
    publicIdField: "profileImagePublicId",
  });

  return buildDriverImageResponse(driver, "Profile image updated successfully");
};

export const updateDriverLicenseImage = async (
  driver: HydratedDocument<Driver>,
  file?: Express.Multer.File,
): Promise<UpdateDriverImageResponse> => {
  if (!file) {
    throw new AppError("License image is required", 400);
  }

  await updateDriverImage({
    driver,
    file,
    folder: "ridergo/drivers/license-images",
    imageField: "licenseImage",
    publicIdField: "licenseImagePublicId",
  });

  return buildDriverImageResponse(driver, "License image updated successfully");
};

export const updateDriverRcImage = async (
  driver: HydratedDocument<Driver>,
  file?: Express.Multer.File,
): Promise<UpdateDriverImageResponse> => {
  if (!file) {
    throw new AppError("RC image is required", 400);
  }

  await updateDriverImage({
    driver,
    file,
    folder: "ridergo/drivers/rc-images",
    imageField: "rcImage",
    publicIdField: "rcImagePublicId",
  });

  return buildDriverImageResponse(driver, "RC image updated successfully");
};

export const updateDriverVehicleImage = async (
  driver: HydratedDocument<Driver>,
  file?: Express.Multer.File,
): Promise<UpdateDriverImageResponse> => {
  if (!file) {
    throw new AppError("Vehicle image is required", 400);
  }

  await updateDriverImage({
    driver,
    file,
    folder: "ridergo/drivers/vehicle-images",
    imageField: "vehicleImage",
    publicIdField: "vehicleImagePublicId",
  });

  return buildDriverImageResponse(driver, "Vehicle image updated successfully");
};

export const updateDriverLocation = async (
  driver: HydratedDocument<Driver>,
  { latitude, longitude }: UpdateDriverLocationInput,
): Promise<UpdateDriverLocationResponse> => {
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new AppError("Invalid coordinates", 400);
  }

  driver.currentLocation = {
    type: "Point",
    coordinates: [longitude, latitude],
    lastUpdated: new Date(),
  };

  await driver.save();

  return {
    success: true,
    message: "Location updated successfully",
  };
};
