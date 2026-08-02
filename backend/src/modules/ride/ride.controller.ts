import { ParamsDictionary } from "express-serve-static-core";
import asyncHandler from "../../utils/asyncHandler.js";
import { Driver } from "../driver/driver.model.js";
import { User } from "../user/user.model.js";
import { HydratedDocument } from "mongoose";

import {
  getDriverRide,
  driverArrived,
  createRide,
  verifyRideOtp,
  acceptRide,
  rejectRide,
  startRide,
  completeRide,
  cancelRideByUser,
  cancelRideByDriver,
  getUserRideHistory,
  getDriverRideHistory,
  getRideDetails,
} from "./ride.service.js";

import {
  CreateRideInput,
  CreateRideResponse,
  GetDriverRideResponse,
  DriverArrivedResponse,
  VerifyRideOtpInput,
  VerifyRideOtpResponse,
  AcceptRideResponse,
  RejectRideResponse,
  StartRideResponse,
  CompleteRideResponse,
  CancelRideInput,
  CancelRideResponse,
  CancelRideByDriverResponse,
  RideHistoryResponse,
  RideDetailsResponse,
} from "./ride.types.js";

type RideIdParams = {
  rideId: string;
};

export const create = asyncHandler<
  ParamsDictionary,
  CreateRideResponse,
  CreateRideInput
>(async (req, res) => {
  const result = await createRide(
    req.account as HydratedDocument<User>,
    req.body,
  );

  res.status(201).json(result);
});

export const driverRide = asyncHandler<ParamsDictionary, GetDriverRideResponse>(
  async (req, res) => {
    const result = await getDriverRide(req.account as HydratedDocument<Driver>);

    res.status(200).json(result);
  },
);

export const arrived = asyncHandler<RideIdParams, DriverArrivedResponse>(
  async (req, res) => {
    const result = await driverArrived(
      req.account as HydratedDocument<Driver>,
      req.params.rideId,
    );

    res.status(200).json(result);
  },
);

export const verifyOtp = asyncHandler<
  RideIdParams,
  VerifyRideOtpResponse,
  VerifyRideOtpInput
>(async (req, res) => {
  const result = await verifyRideOtp(
    req.account as HydratedDocument<Driver>,
    req.params.rideId,
    req.body,
  );

  res.status(200).json(result);
});

export const accept = asyncHandler<RideIdParams, AcceptRideResponse>(
  async (req, res) => {
    const result = await acceptRide(
      req.account as HydratedDocument<Driver>,
      req.params.rideId,
    );

    res.status(200).json(result);
  },
);

export const reject = asyncHandler<RideIdParams, RejectRideResponse>(
  async (req, res) => {
    const result = await rejectRide(
      req.account as HydratedDocument<Driver>,
      req.params.rideId,
    );

    res.status(200).json(result);
  },
);

export const start = asyncHandler<RideIdParams, StartRideResponse>(
  async (req, res) => {
    const result = await startRide(
      req.account as HydratedDocument<Driver>,
      req.params.rideId,
    );

    res.status(200).json(result);
  },
);

export const complete = asyncHandler<RideIdParams, CompleteRideResponse>(
  async (req, res) => {
    const result = await completeRide(
      req.account as HydratedDocument<Driver>,
      req.params.rideId,
    );

    res.status(200).json(result);
  },
);

export const cancelByUser = asyncHandler<
  RideIdParams,
  CancelRideResponse,
  CancelRideInput
>(async (req, res) => {
  const result = await cancelRideByUser(
    req.account as HydratedDocument<User>,
    req.params.rideId,
    req.body,
  );

  res.status(200).json(result);
});

export const cancelByDriver = asyncHandler<
  RideIdParams,
  CancelRideByDriverResponse,
  CancelRideInput
>(async (req, res) => {
  const result = await cancelRideByDriver(
    req.account as HydratedDocument<Driver>,
    req.params.rideId,
    req.body,
  );

  res.status(200).json(result);
});

export const userRideHistory = asyncHandler<
  ParamsDictionary,
  RideHistoryResponse
>(async (req, res) => {
  const result = await getUserRideHistory(
    req.account as HydratedDocument<User>,
  );

  res.status(200).json(result);
});

export const driverRideHistory = asyncHandler<
  ParamsDictionary,
  RideHistoryResponse
>(async (req, res) => {
  const result = await getDriverRideHistory(
    req.account as HydratedDocument<Driver>,
  );

  res.status(200).json(result);
});

export const rideDetails = asyncHandler<RideIdParams, RideDetailsResponse>(
  async (req, res) => {
    const result = await getRideDetails(
      req.account as HydratedDocument<User> | HydratedDocument<Driver>,
      req.params.rideId,
    );

    res.status(200).json(result);
  },
);
