import { ParamsDictionary } from "express-serve-static-core";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { createPayment, verifyPayment } from "./payment.service.js";
import {
  CreatePaymentInput,
  CreatePaymentResponse,
  VerifyPaymentInput,
  VerifyPaymentResponse,
} from "./payment.types.js";

export const createPaymentController = asyncHandler<
  ParamsDictionary,
  CreatePaymentResponse,
  CreatePaymentInput
>(async (req, res) => {
  if (req.accountType !== "User") {
    throw new AppError("Only users can create payments.", 403);
  }

  const { rideId } = req.body;

  const result = await createPayment(req.account._id.toString(), rideId);

  res.status(201).json(result);
});

export const verifyPaymentController = asyncHandler<
  ParamsDictionary,
  VerifyPaymentResponse,
  VerifyPaymentInput
>(async (req, res) => {
  if (req.accountType !== "User") {
    throw new AppError("Only users can verify payments.", 403);
  }

  const result = await verifyPayment(req.account._id.toString(), req.body);

  res.status(200).json(result);
});
