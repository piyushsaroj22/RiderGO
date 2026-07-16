import { HydratedDocument } from "mongoose";
import asyncHandler from "../../utils/asyncHandler.js";
import { User } from "../user/user.model.js";
import { Driver } from "../driver/driver.model.js";
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

export const create = asyncHandler(async (req, res) => {
  const result = await createRide(
    req.account as HydratedDocument<User>,
    req.body,
  );

  res.status(201).json(result);
});

export const driverRide = asyncHandler(async (req, res) => {
  const result = await getDriverRide(req.account as HydratedDocument<Driver>);

  res.status(200).json(result);
});

export const arrived = asyncHandler(async (req, res) => {
  const result = await driverArrived(
    req.account as HydratedDocument<Driver>,
    req.params.rideId as string,
  );

  res.status(200).json(result);
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const result = await verifyRideOtp(
    req.account as HydratedDocument<Driver>,
    req.params.rideId as string,
    req.body,
  );

  res.status(200).json(result);
});

export const accept = asyncHandler(async (req, res) => {
  const result = await acceptRide(
    req.account as HydratedDocument<Driver>,
    req.params.rideId as string,
  );

  res.status(200).json(result);
});

export const start = asyncHandler(async (req, res) => {
  const result = await startRide(
    req.account as HydratedDocument<Driver>,
    req.params.rideId as string,
  );

  res.status(200).json(result);
});

export const reject = asyncHandler(async (req, res) => {
  const result = await rejectRide(
    req.account as HydratedDocument<Driver>,
    req.params.rideId as string,
  );

  res.status(200).json(result);
});

export const complete = asyncHandler(async (req, res) => {
  const result = await completeRide(
    req.account as HydratedDocument<Driver>,
    req.params.rideId as string,
  );

  res.status(200).json(result);
});

export const cancelByUser = asyncHandler(async (req, res) => {
  const result = await cancelRideByUser(
    req.account as HydratedDocument<User>,
    req.params.rideId as string,
    req.body,
  );

  res.status(200).json(result);
});

export const cancelByDriver = asyncHandler(async (req, res) => {
  const result = await cancelRideByDriver(
    req.account as HydratedDocument<Driver>,
    req.params.rideId as string,
    req.body,
  );

  res.status(200).json(result);
});

export const userRideHistory = asyncHandler(async (req, res) => {
  const result = await getUserRideHistory(
    req.account as HydratedDocument<User>,
  );

  res.status(200).json(result);
});

export const driverRideHistory = asyncHandler(async (req, res) => {
  const result = await getDriverRideHistory(
    req.account as HydratedDocument<Driver>,
  );

  res.status(200).json(result);
});

export const rideDetails = asyncHandler(async (req, res) => {
  const result = await getRideDetails(
    req.account as HydratedDocument<User> | HydratedDocument<Driver>,
    req.params.rideId as string,
  );

  res.status(200).json(result);
});
