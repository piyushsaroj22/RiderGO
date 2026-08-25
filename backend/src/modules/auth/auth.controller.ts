import { ParamsDictionary } from "express-serve-static-core";
import asyncHandler from "../../utils/asyncHandler.js";
import { clearAuthCookie } from "../../utils/cookie.js";
import { HydratedDocument } from "mongoose";
import { User } from "../user/user.model.js";
import AppError from "../../utils/AppError.js";

import {
  registerUser,
  verifyUserEmail,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetUserPassword,
} from "./auth.service.js";

import {
  RegisterUserInput,
  RegisterUserResponse,
  LoginUserInput,
  LoginUserResponse,
  VerifyUserEmailResponse,
  LogoutUserResponse,
  GetCurrentUserResponse,
  ForgotPasswordInput,
  ForgotPasswordResponse,
  ResetPasswordInput,
  ResetPasswordResponse,
} from "./auth.types.js";

import type { PasswordResetAccountType } from "../passwordReset/passwordReset.service.js";

type VerifyEmailParams = {
  token: string;
};

const getPasswordResetAccountType = (
  value: string,
): PasswordResetAccountType => {
  if (value !== "user" && value !== "driver" && value !== "admin") {
    throw new AppError("Invalid account type", 400);
  }

  return (value.charAt(0).toUpperCase() +
    value.slice(1)) as PasswordResetAccountType;
};

export const register = asyncHandler<
  ParamsDictionary,
  RegisterUserResponse,
  RegisterUserInput
>(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json(result);
});

export const verifyEmail = asyncHandler<
  VerifyEmailParams,
  VerifyUserEmailResponse
>(async (req, res) => {
  const { token } = req.params;

  const result = await verifyUserEmail(token, res);

  res.status(200).json(result);
});

export const login = asyncHandler<
  ParamsDictionary,
  LoginUserResponse,
  LoginUserInput
>(async (req, res) => {
  const result = await loginUser(req.body, res);

  res.status(200).json(result);
});

export const logout = asyncHandler<ParamsDictionary, LogoutUserResponse>(
  async (req, res) => {
    const result = await logoutUser();

    clearAuthCookie(res);

    res.status(200).json(result);
  },
);

export const me = asyncHandler<ParamsDictionary, GetCurrentUserResponse>(
  async (req, res) => {
    const result = await getCurrentUser(req.account as HydratedDocument<User>);

    res.status(200).json(result);
  },
);

type PasswordResetParams = {
  token: string;
  accountType: string;
};

export const forgotPasswordController = asyncHandler<
  ParamsDictionary,
  ForgotPasswordResponse,
  ForgotPasswordInput
>(async (req, res) => {
  const result = await forgotPassword(req.body.email, "User");

  res.status(200).json(result);
});

export const resetPasswordController = asyncHandler<
  PasswordResetParams,
  ResetPasswordResponse,
  ResetPasswordInput
>(async (req, res) => {
  const result = await resetUserPassword(
    req.params.token,
    req.body.password,
    "User",
  );

  res.status(200).json(result);
});
