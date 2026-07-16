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

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json(result);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token as string;

  const result = await verifyUserEmail(token, res);

  res.status(200).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body, res);

  res.status(200).json(result);
});

export const logout = asyncHandler(async (req, res) => {
  const result = await logoutUser();

  clearAuthCookie(res);

  res.status(200).json(result);
});

export const me = asyncHandler(async (req, res) => {
  const result = await getCurrentUser(req.account as HydratedDocument<User>);

  res.status(200).json(result);
});
