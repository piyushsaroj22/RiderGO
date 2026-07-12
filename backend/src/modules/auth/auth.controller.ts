import asyncHandler from "../../utils/asyncHandler.js";
import { registerUser, verifyUserEmail, loginUser } from "./auth.service.js";

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
