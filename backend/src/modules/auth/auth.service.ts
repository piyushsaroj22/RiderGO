import bcrypt from "bcrypt";
import AppError from "../../utils/AppError.js";
import UserModel from "../user/user.model.js";
import { Response } from "express";
import { generateToken } from "../../utils/jwt.js";
import { setAuthCookie } from "../../utils/cookie.js";
import EmailVerificationModel from "../emailVerification/emailVerification.model.js";
import { sendVerificationEmail } from "../emailVerification/emailVerification.service.js";
import { HydratedDocument } from "mongoose";
import { GetCurrentUserResponse } from "./auth.types.js";
import { User } from "../user/user.model.js";
import {
  RegisterUserInput,
  LoginUserInput,
  LoginUserResponse,
  VerifyUserEmailResponse,
} from "./auth.types.js";

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserInput) => {
  // Validate required fields
  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  // Check if email already exists
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = new UserModel({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  await sendVerificationEmail(user._id.toString(), user.name, user.email);

  return {
    success: true,
    message: "Registration successful. Please verify your email.",
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  };
};

export const verifyUserEmail = async (
  token: string,
  res: Response,
): Promise<VerifyUserEmailResponse> => {
  const verificationToken = await EmailVerificationModel.findOne({
    token,
  });

  if (!verificationToken) {
    throw new AppError("Invalid verification token", 400);
  }

  if (verificationToken.expiresAt < new Date()) {
    await EmailVerificationModel.deleteOne({
      _id: verificationToken._id,
    });

    throw new AppError("Verification token has expired", 400);
  }

  const user = await UserModel.findById(verificationToken.user);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isEmailVerified = true;

  await user.save();

  await EmailVerificationModel.deleteOne({
    _id: verificationToken._id,
  });

  const jwtToken = generateToken(user._id.toString());

  setAuthCookie(res, jwtToken);

  return {
    success: true,
    message: "Email verified successfully",
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

export const loginUser = async (
  { email, password }: LoginUserInput,
  res: Response,
): Promise<LoginUserResponse> => {
  // Validate required fields
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // Find user
  const user = await UserModel.findOne({ email });

  // Invalid credentials
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // Check email verification
  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email before logging in", 403);
  }

  // Generate JWT
  const jwtToken = generateToken(user._id.toString());

  // Set Cookie
  setAuthCookie(res, jwtToken);

  // Return response
  return {
    success: true,
    message: "Login successful",
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

export const logoutUser = async () => {
  return {
    success: true,
    message: "Logout successful",
  };
};

export const getCurrentUser = async (
  user: HydratedDocument<User>,
): Promise<GetCurrentUserResponse> => {
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
