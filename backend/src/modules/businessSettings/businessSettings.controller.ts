import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  getBusinessSettings,
  updateBusinessSettings,
} from "./businessSettings.service.js";
import {
  GetBusinessSettingsResponse,
  UpdateBusinessSettingsInput,
  UpdateBusinessSettingsResponse,
} from "./businessSettings.types.js";

export const getBusinessSettingsController = asyncHandler<
  Record<string, never>,
  GetBusinessSettingsResponse
>(async (_req: Request, res: Response) => {
  const result = await getBusinessSettings();

  res.status(200).json(result);
});

export const updateBusinessSettingsController = asyncHandler<
  Record<string, never>,
  UpdateBusinessSettingsResponse,
  UpdateBusinessSettingsInput
>(async (req, res) => {
  const result = await updateBusinessSettings(req.body);

  res.status(200).json(result);
});
