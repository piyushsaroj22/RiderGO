import { ParamsDictionary } from "express-serve-static-core";
import asyncHandler from "../../utils/asyncHandler.js";
import { clearAuthCookie } from "../../utils/cookie.js";
import { HydratedDocument } from "mongoose";
import { User } from "../user/user.model.js";

import {
  registerUser,
  verifyUserEmail,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "./auth.service.js";

import {
  RegisterUserInput,
  RegisterUserResponse,
  LoginUserInput,
  LoginUserResponse,
  VerifyUserEmailResponse,
  LogoutUserResponse,
  GetCurrentUserResponse,
} from "./auth.types.js";

type VerifyEmailParams = {
  token: string;
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
