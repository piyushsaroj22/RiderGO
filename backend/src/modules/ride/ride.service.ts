import { HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import env from "../../config/env.js";
import { User } from "../user/user.model.js";
import AppError from "../../utils/AppError.js";
import RideModel from "./ride.model.js";
import DriverModel from "../driver/driver.model.js";
import { calculateFare } from "../../services/pricing.service.js";
import { getRouteDetails } from "../../services/maps.service.js";
import { CreateRideInput, CreateRideResponse } from "./ride.types.js";
// import { findNearbyDrivers } from "../../services/driverMatching.service.js";
import { Driver } from "../driver/driver.model.js";
import {
  getPendingRideOffer,
  acceptRideOffer,
  rejectRideOffer,
  expireAllRideOffers,
} from "../rideOffer/rideOffer.service.js";
import {
  dispatchRide,
  assignRideToDriver,
  dispatchNextDriver,
} from "../../services/dispatch.service.js";
import {
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
  RideHistoryItem,
  RideDetailsResponse,
} from "./ride.types.js";

export const createRide = async (
  rider: HydratedDocument<User>,
  { pickup, destination, vehicleType, paymentMethod }: CreateRideInput,
): Promise<CreateRideResponse> => {
  // Validation
  if (!pickup || !destination || !vehicleType || !paymentMethod) {
    throw new AppError("All fields are required", 400);
  }

  // TODO
  // Google Maps API
  const route = await getRouteDetails(
    {
      latitude: pickup.latitude,
      longitude: pickup.longitude,
    },
    {
      latitude: destination.latitude,
      longitude: destination.longitude,
    },
  );

  const distance = route.distance;
  const duration = route.duration;

  // Fare
  const fare = calculateFare({
    vehicleType,
    distance,
    duration,
  });

  // Generate Ride OTP
  const plainOtp = crypto.randomInt(100000, 999999).toString();

  const hashedOtp = await bcrypt.hash(plainOtp, 10);

  const ride = await RideModel.create({
    rider: rider._id,
    pickup,
    destination,
    vehicleType,
    distance,
    duration,
    fare,
    paymentMethod,
    otp: hashedOtp,
  });

  console.log("Ride OTP:", plainOtp); //todo remove but last me remove karna hai

  await dispatchRide(ride._id.toString());

  return {
    success: true,
    message: "Ride created successfully",
    data: {
      id: ride._id.toString(),
      rider: rider._id.toString(),
      pickup: ride.pickup!,
      destination: ride.destination!,
      vehicleType: ride.vehicleType,
      fare: ride.fare,
      distance: ride.distance,
      duration: ride.duration,
      paymentMethod: ride.paymentMethod,
      paymentStatus: ride.paymentStatus,
      status: ride.status,
    },
  };
};

export const getDriverRide = async (
  driver: HydratedDocument<Driver>,
): Promise<GetDriverRideResponse> => {
  const ride = await RideModel.findOne({
    driver: driver._id,
    status: {
      $in: ["DRIVER_ASSIGNED", "DRIVER_ARRIVED", "OTP_VERIFIED", "IN_PROGRESS"],
    },
  });

  if (!ride) {
    throw new AppError("No active ride found", 404);
  }

  return {
    success: true,
    data: {
      id: ride._id.toString(),
      rider: ride.rider.toString(),
      pickup: ride.pickup!,
      destination: ride.destination!,
      vehicleType: ride.vehicleType,
      fare: ride.fare,
      distance: ride.distance,
      duration: ride.duration,
      paymentMethod: ride.paymentMethod,
      paymentStatus: ride.paymentStatus,
      status: ride.status,
    },
  };
};

export const driverArrived = async (
  driver: HydratedDocument<Driver>,
  rideId: string,
): Promise<DriverArrivedResponse> => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new AppError("Ride not found", 404);
  }

  if (!ride.driver) {
    throw new AppError("Driver not assigned", 400);
  }

  if (ride.driver.toString() !== driver._id.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  if (ride.status !== "DRIVER_ASSIGNED") {
    throw new AppError("Driver has already arrived", 400);
  }

  ride.status = "DRIVER_ARRIVED";

  await ride.save();

  return {
    success: true,
    message: "Driver arrived successfully",
    data: {
      id: ride._id.toString(),
      status: ride.status,
    },
  };
};

export const verifyRideOtp = async (
  driver: HydratedDocument<Driver>,
  rideId: string,
  { otp }: VerifyRideOtpInput,
): Promise<VerifyRideOtpResponse> => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new AppError("Ride not found", 404);
  }

  if (!ride.driver) {
    throw new AppError("Driver not assigned", 400);
  }

  if (ride.driver.toString() !== driver._id.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  if (ride.status !== "DRIVER_ARRIVED") {
    throw new AppError("Driver has not arrived yet", 400);
  }

  const isOtpValid = await bcrypt.compare(otp, ride.otp);

  if (!isOtpValid) {
    throw new AppError("Invalid OTP", 400);
  }

  ride.status = "OTP_VERIFIED";
  ride.otp = "";

  await ride.save();

  return {
    success: true,
    message: "OTP verified successfully",
    data: {
      id: ride._id.toString(),
      status: ride.status,
    },
  };
};

export const acceptRide = async (
  driver: HydratedDocument<Driver>,
  rideId: string,
): Promise<AcceptRideResponse> => {
  const offer = await getPendingRideOffer(rideId, driver._id.toString());

  if (!offer) {
    throw new AppError("Ride offer not found", 404);
  }

  await acceptRideOffer(rideId, driver._id.toString());

  await assignRideToDriver(rideId, driver._id);

  return {
    success: true,
    message: "Ride accepted successfully",
  };
};

export const rejectRide = async (
  driver: HydratedDocument<Driver>,
  rideId: string,
): Promise<RejectRideResponse> => {
  const offer = await getPendingRideOffer(rideId, driver._id.toString());

  if (!offer) {
    throw new AppError("Ride offer not found", 404);
  }

  await rejectRideOffer(rideId, driver._id.toString());

  await dispatchNextDriver(rideId);

  return {
    success: true,
    message: "Ride rejected successfully",
  };
};

export const startRide = async (
  driver: HydratedDocument<Driver>,
  rideId: string,
): Promise<StartRideResponse> => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new AppError("Ride not found", 404);
  }

  if (!ride.driver) {
    throw new AppError("Driver not assigned", 400);
  }

  if (ride.driver.toString() !== driver._id.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  if (ride.status !== "OTP_VERIFIED") {
    throw new AppError("OTP verification is required", 400);
  }

  ride.status = "IN_PROGRESS";

  await ride.save();

  return {
    success: true,
    message: "Ride started successfully",
    data: {
      id: ride._id.toString(),
      status: ride.status,
    },
  };
};

export const completeRide = async (
  driver: HydratedDocument<Driver>,
  rideId: string,
): Promise<CompleteRideResponse> => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new AppError("Ride not found", 404);
  }

  if (!ride.driver) {
    throw new AppError("Driver not assigned", 400);
  }

  if (ride.driver.toString() !== driver._id.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  if (ride.status !== "IN_PROGRESS") {
    throw new AppError("Ride is not in progress", 400);
  }

  ride.status = "COMPLETED";

  if (ride.paymentMethod === "Cash") {
    ride.paymentStatus = "PAID";
  }

  await ride.save();

  driver.isAvailable = true;

  await driver.save();

  return {
    success: true,
    message: "Ride completed successfully",
    data: {
      id: ride._id.toString(),
      status: ride.status,
      paymentStatus: ride.paymentStatus,
    },
  };
};

export const cancelRideByUser = async (
  rider: HydratedDocument<User>,
  rideId: string,
  { reason }: CancelRideInput,
): Promise<CancelRideResponse> => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new AppError("Ride not found", 404);
  }

  if (ride.rider.toString() !== rider._id.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  // Free cancellation before driver accepts
  if (ride.status === "SEARCHING") {
    ride.status = "CANCELLED";
    ride.cancelledBy = "User";
    ride.cancelledAt = new Date();
    ride.cancellationReason = reason;
    ride.dispatch.isDispatchCompleted = true;

    await ride.save();

    await expireAllRideOffers(rideId);

    return {
      success: true,
      message: "Ride cancelled successfully",
    };
  }

  // Cancellation after driver accepts
  if (ride.status === "DRIVER_ASSIGNED" || ride.status === "DRIVER_ARRIVED") {
    ride.status = "CANCELLED";
    ride.cancelledBy = "User";
    ride.cancelledAt = new Date();
    ride.cancellationReason = reason;
    ride.cancellationFee = Number(env.USER_CANCELLATION_FEE);
    ride.dispatch.isDispatchCompleted = true;

    rider.pendingCancellationFee += Number(env.USER_CANCELLATION_FEE);

    await rider.save();

    if (ride.driver) {
      await DriverModel.findByIdAndUpdate(ride.driver, {
        isAvailable: true,
      });

      ride.driver = null;
    }

    await ride.save();

    await expireAllRideOffers(rideId);

    return {
      success: true,
      message: "Ride cancelled successfully",
    };
  }

  throw new AppError("Ride can no longer be cancelled", 400);
};

export const cancelRideByDriver = async (
  driver: HydratedDocument<Driver>,
  rideId: string,
  { reason }: CancelRideInput,
): Promise<CancelRideByDriverResponse> => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new AppError("Ride not found", 404);
  }

  if (!ride.driver) {
    throw new AppError("Driver not assigned", 400);
  }

  if (ride.driver.toString() !== driver._id.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  if (ride.status !== "DRIVER_ASSIGNED" && ride.status !== "DRIVER_ARRIVED") {
    throw new AppError("Ride can no longer be cancelled", 400);
  }

  // Driver penalty
  driver.pendingPenalty += Number(env.DRIVER_CANCELLATION_PENALTY);

  driver.isAvailable = true;

  await driver.save();

  ride.driver = null;

  ride.status = "SEARCHING";

  // ride.dispatch.currentDriverIndex++;

  await ride.save();

  await dispatchNextDriver(rideId);

  return {
    success: true,
    message: "Ride cancelled successfully",
  };
};

export const getUserRideHistory = async (
  rider: HydratedDocument<User>,
): Promise<RideHistoryResponse> => {
  const rides = await RideModel.find({
    rider: rider._id,
  })
    .sort({
      createdAt: -1,
    })
    .select(
      "pickup destination vehicleType fare distance duration paymentMethod paymentStatus status createdAt",
    );

  return {
    success: true,
    data: rides.map((ride) => ({
      id: ride._id.toString(),
      pickup: ride.pickup!,
      destination: ride.destination!,
      vehicleType: ride.vehicleType,
      fare: ride.fare,
      distance: ride.distance,
      duration: ride.duration,
      paymentMethod: ride.paymentMethod,
      paymentStatus: ride.paymentStatus,
      status: ride.status,
      createdAt: ride.createdAt,
    })),
  };
};

export const getDriverRideHistory = async (
  driver: HydratedDocument<Driver>,
): Promise<RideHistoryResponse> => {
  const rides = await RideModel.find({
    driver: driver._id,
  })
    .sort({
      createdAt: -1,
    })
    .select(
      "pickup destination vehicleType fare distance duration paymentMethod paymentStatus status createdAt",
    );

  return {
    success: true,
    data: rides.map((ride) => ({
      id: ride._id.toString(),
      pickup: ride.pickup!,
      destination: ride.destination!,
      vehicleType: ride.vehicleType,
      fare: ride.fare,
      distance: ride.distance,
      duration: ride.duration,
      paymentMethod: ride.paymentMethod,
      paymentStatus: ride.paymentStatus,
      status: ride.status,
      createdAt: ride.createdAt,
    })),
  };
};

export const getRideDetails = async (
  account: HydratedDocument<User> | HydratedDocument<Driver>,
  rideId: string,
): Promise<RideDetailsResponse> => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new AppError("Ride not found", 404);
  }

  const accountId = account._id.toString();

  const isRider = ride.rider.toString() === accountId;

  const isDriver = ride.driver != null && ride.driver.toString() === accountId;

  if (!isRider && !isDriver) {
    throw new AppError("Unauthorized", 403);
  }

  return {
    success: true,
    data: {
      id: ride._id.toString(),
      rider: ride.rider.toString(),
      driver: ride.driver ? ride.driver.toString() : null,
      pickup: ride.pickup!,
      destination: ride.destination!,
      vehicleType: ride.vehicleType,
      fare: ride.fare,
      distance: ride.distance,
      duration: ride.duration,
      paymentMethod: ride.paymentMethod,
      paymentStatus: ride.paymentStatus,
      status: ride.status,
      cancellationFee: ride.cancellationFee,
      cancellationReason: ride.cancellationReason,
      cancelledBy: ride.cancelledBy ?? null,
      cancelledAt: ride.cancelledAt ?? null,
      createdAt: ride.createdAt!,
      updatedAt: ride.updatedAt!,
    },
  };
};
