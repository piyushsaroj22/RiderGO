import asyncHandler from "../../utils/asyncHandler.js";
import { registerUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json(result);
});
