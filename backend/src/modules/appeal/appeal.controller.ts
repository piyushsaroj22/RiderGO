import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { HydratedDocument } from "mongoose";

import asyncHandler from "../../utils/asyncHandler.js";

import { Driver } from "../driver/driver.model.js";
import { Admin } from "../admin/admin.model.js";

import {
  createAppeal,
  getAdminAppeals,
  reviewAppeal,
} from "./appeal.service.js";

import {
  CreateAppealInput,
  CreateAppealResponse,
  GetAdminAppealsQuery,
  GetAdminAppealsQueryParams,
  GetAdminAppealsResponse,
  ReviewAppealInput,
  ReviewAppealParams,
  ReviewAppealResponse,
} from "./appeal.types.js";

type AppealIdParams = {
  appealId: string;
};

export const createAppealController = asyncHandler<
  Record<string, never>,
  CreateAppealResponse,
  CreateAppealInput
>(async (req: Request, res: Response) => {
  const driver = req.account as HydratedDocument<Driver>;

  const result = await createAppeal(driver, req.body);

  res.status(201).json(result);
});

export const getAdminAppealsController = asyncHandler<
  ParamsDictionary,
  GetAdminAppealsResponse,
  never,
  GetAdminAppealsQueryParams
>(async (req, res) => {
  const queryParams: GetAdminAppealsQueryParams = req.query;

  const query: GetAdminAppealsQuery = {
    page: queryParams.page ? Number(queryParams.page) : 1,
    limit: queryParams.limit ? Number(queryParams.limit) : 20,
    status: queryParams.status,
    search: queryParams.search,
    sortOrder: queryParams.sortOrder ?? "desc",
  };

  const result = await getAdminAppeals(query);

  res.status(200).json(result);
});

export const reviewAppealController = asyncHandler<
  AppealIdParams,
  ReviewAppealResponse,
  ReviewAppealInput
>(async (req, res) => {
  const admin = req.account as HydratedDocument<Admin>;

  const result = await reviewAppeal(req.params.appealId, admin, req.body);

  res.status(200).json(result);
});
