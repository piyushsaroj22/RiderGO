import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { Response } from "express";
import AppError from "../../utils/AppError.js";
import { generateToken } from "../../utils/jwt.js";
import { setAuthCookie } from "../../utils/cookie.js";
import AdminModel from "./admin.model.js";
import DriverModel from "../driver/driver.model.js";
import { HydratedDocument } from "mongoose";
import { Admin } from "./admin.model.js";
import {
  RegisterAdminInput,
  RegisterAdminResponse,
  AdminLoginInput,
  AdminLoginResponse,
  GetCurrentAdminResponse,
  GetPendingDriversResponse,
  GetDriverDetailsResponse,
  UpdateDriverVerificationInput,
  UpdateDriverVerificationResponse,
  LogoutAdminResponse,
} from "./admin.types.js";

export const registerAdmin = async (
  { fullName, email, password }: RegisterAdminInput,
  res: Response,
): Promise<RegisterAdminResponse> => {
  // Validate required fields
  if (!fullName || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  // Check if super admin already exists
  const adminExists = await AdminModel.exists({});

  if (adminExists) {
    throw new AppError("Super admin already exists", 409);
  }

  // Check duplicate email
  const existingAdmin = await AdminModel.findOne({ email });

  if (existingAdmin) {
    throw new AppError("Email already exists", 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin
  const admin = await AdminModel.create({
    fullName,
    email,
    password: hashedPassword,
    role: "SUPER_ADMIN",
  });

  // Generate JWT
  const jwtToken = generateToken(admin._id.toString(), "Admin");

  // Set Cookie
  setAuthCookie(res, jwtToken);

  return {
    success: true,
    message: "Super admin registered successfully",
    data: {
      id: admin._id.toString(),
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
  };
};

export const loginAdmin = async (
  { email, password }: AdminLoginInput,
  res: Response,
): Promise<AdminLoginResponse> => {
  // Validate required fields
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // Find admin
  const admin = await AdminModel.findOne({ email }).select("+password");

  if (!admin) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // Check active status
  if (!admin.isActive) {
    throw new AppError("Your account has been deactivated", 403);
  }

  // Update last login
  admin.lastLogin = new Date();

  await admin.save();

  // Generate JWT
  const jwtToken = generateToken(admin._id.toString(), "Admin");

  // Set cookie
  setAuthCookie(res, jwtToken);

  return {
    success: true,
    message: "Login successful",
    data: {
      id: admin._id.toString(),
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    },
  };
};

export const logoutAdmin = async (): Promise<LogoutAdminResponse> => {
  return {
    success: true,
    message: "Logout successful",
  };
};

export const getCurrentAdmin = async (
  admin: HydratedDocument<Admin>,
): Promise<GetCurrentAdminResponse> => {
  return {
    success: true,
    data: {
      id: admin._id.toString(),
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin ?? null,
    },
  };
};

export const getPendingDrivers =
  async (): Promise<GetPendingDriversResponse> => {
    const drivers = await DriverModel.find({
      verificationStatus: "PENDING",
    }).sort({
      createdAt: 1,
    });

    return {
      success: true,
      data: drivers.map((driver) => ({
        id: driver._id.toString(),
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        vehicleType: driver.vehicleType,
        verificationStatus: driver.verificationStatus,
        createdAt: driver.createdAt,
      })),
    };
  };

export const getDriverVerificationDetails = async (
  driverId: string,
): Promise<GetDriverDetailsResponse> => {
  // Validate Driver ID
  if (!Types.ObjectId.isValid(driverId)) {
    throw new AppError("Invalid driver ID", 400);
  }

  // Find Driver
  const driver = await DriverModel.findById(driverId);

  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  return {
    success: true,
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

      verificationStatus: driver.verificationStatus,
      rejectionReason: driver.rejectionReason,
      approvedAt: driver.approvedAt ?? null,

      isEmailVerified: driver.isEmailVerified,

      createdAt: driver.createdAt,
    },
  };
};

export const updateDriverVerification = async (
  driverId: string,
  adminId: string,
  payload: UpdateDriverVerificationInput,
): Promise<UpdateDriverVerificationResponse> => {
  // Validate Driver ID
  if (!Types.ObjectId.isValid(driverId)) {
    throw new AppError("Invalid driver ID", 400);
  }

  // Validate Admin ID
  if (!Types.ObjectId.isValid(adminId)) {
    throw new AppError("Invalid admin ID", 400);
  }

  const driver = await DriverModel.findById(driverId);

  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  const { status, rejectionReason } = payload;

  // Reject validation
  if (status === "REJECTED") {
    if (!rejectionReason?.trim()) {
      throw new AppError(
        "Rejection reason is required when rejecting a driver.",
        400,
      );
    }
  }

  // Prevent unnecessary updates
  if (driver.verificationStatus === status) {
    throw new AppError(`Driver is already ${status.toLowerCase()}.`, 400);
  }

  if (status === "APPROVED") {
    driver.verificationStatus = "APPROVED";
    driver.rejectionReason = "";
    driver.approvedAt = new Date();
    driver.verifiedBy = new Types.ObjectId(adminId);
  } else {
    driver.verificationStatus = "REJECTED";
    driver.rejectionReason = rejectionReason!.trim();
    driver.approvedAt = null;
    driver.verifiedBy = null;
  }

  await driver.save();

  return {
    success: true,
    message: `Driver ${status.toLowerCase()} successfully.`,
  };
};
