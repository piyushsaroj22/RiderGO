import { Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import asyncHandler from "../../utils/asyncHandler.js";
import { Driver } from "../driver/driver.model.js";
import { createAppeal } from "./appeal.service.js";
import { CreateAppealInput, CreateAppealResponse } from "./appeal.types.js";

export const createAppealController = asyncHandler<
  Record<string, never>,
  CreateAppealResponse,
  CreateAppealInput
>(async (req: Request, res: Response) => {
  const driver = req.account as HydratedDocument<Driver>;

  const result = await createAppeal(driver, req.body);

  res.status(201).json(result);
});
