import { getIO } from "./socket.js";
import {
  RideOfferPayload,
  RideAcceptedPayload,
  RideDriverArrivedPayload,
  RideOtpVerifiedPayload,
  RideStartedPayload,
  RideCompletedPayload,
  RideCancelledPayload,
  DriverLocationPayload,
  DriverLocationEvent,
  DriverDisconnectedPayload,
} from "./socket.types.js";

export const emitRideOffer = (driverId: string, payload: RideOfferPayload) => {
  getIO().to(`Driver:${driverId}`).emit("ride:offer", payload);
};

export const emitRideAccepted = (
  userId: string,
  payload: RideAcceptedPayload,
) => {
  getIO().to(`User:${userId}`).emit("ride:accepted", payload);
};

export const emitDriverArrived = (
  userId: string,
  payload: RideDriverArrivedPayload,
) => {
  getIO().to(`User:${userId}`).emit("ride:driver-arrived", payload);
};

export const emitRideOtpVerified = (
  userId: string,
  payload: RideOtpVerifiedPayload,
) => {
  getIO().to(`User:${userId}`).emit("ride:otp-verified", payload);
};

export const emitRideStarted = (
  userId: string,
  payload: RideStartedPayload,
) => {
  getIO().to(`User:${userId}`).emit("ride:started", payload);
};

export const emitRideCompleted = (
  userId: string,
  payload: RideCompletedPayload,
) => {
  getIO().to(`User:${userId}`).emit("ride:completed", payload);
};

export const emitRideCancelled = (
  userId: string,
  payload: RideCancelledPayload,
) => {
  getIO().to(`User:${userId}`).emit("ride:cancelled", payload);
};

export const emitDriverLocation = (
  userId: string,
  payload: DriverLocationEvent,
) => {
  getIO().to(`User:${userId}`).emit("driver:location", payload);
};

export const emitDriverDisconnected = (
  userId: string,
  payload: DriverDisconnectedPayload,
) => {
  getIO().to(`User:${userId}`).emit("driver:disconnected", payload);
};
