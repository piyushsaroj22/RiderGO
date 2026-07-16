import { HydratedDocument } from "mongoose";
import RideModel from "../modules/ride/ride.model.js";
import DriverModel, { Driver } from "../modules/driver/driver.model.js";
import { findNearbyDrivers } from "./driverMatching.service.js";
// import RideOfferModel from "../modules/rideOffer/rideOffer.model.js";
import {
  createRideOffer,
  expireAllRideOffers,
} from "../modules/rideOffer/rideOffer.service.js";

const offerCurrentDriver = async (rideId: string) => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.dispatch.currentDriverIndex >= ride.dispatch.queue.length) {
    ride.status = "NO_DRIVER_FOUND";
    ride.dispatch.isDispatchCompleted = true;

    await ride.save();

    return;
  }

  const driverId = ride.dispatch.queue[ride.dispatch.currentDriverIndex];

  await createRideOffer(rideId, driverId.toString());
};

export const dispatchRide = async (rideId: string) => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new Error("Ride not found");
  }

  const nearbyDrivers = await buildDriverQueue(rideId);

  if (nearbyDrivers.length === 0) {
    return;
  }

  // First Driver Only (Sequential Dispatch)
  await offerCurrentDriver(rideId);
};

const buildDriverQueue = async (rideId: string) => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new Error("Ride not found");
  }

  const nearbyDrivers = await findNearbyDrivers({
    latitude: ride.pickup.latitude,
    longitude: ride.pickup.longitude,
  });

  if (nearbyDrivers.length === 0) {
    ride.status = "NO_DRIVER_FOUND";
    ride.dispatch.isDispatchCompleted = true;

    await ride.save();

    return [];
  }

  ride.dispatch.queue = nearbyDrivers.map((driver) => driver._id);
  ride.dispatch.currentDriverIndex = 0;
  ride.dispatch.isDispatchCompleted = false;

  await ride.save();

  return nearbyDrivers;
};

export const assignRideToDriver = async (
  rideId: string,
  driverId: HydratedDocument<Driver>["_id"],
) => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new Error("Ride not found");
  }

  ride.driver = driverId;
  ride.status = "DRIVER_ASSIGNED";

  await ride.save();

  await DriverModel.findByIdAndUpdate(driverId, {
    isAvailable: false,
  });

  await expireAllRideOffers(rideId);
};

export const dispatchNextDriver = async (rideId: string) => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.dispatch.isDispatchCompleted) {
    return;
  }

  ride.dispatch.currentDriverIndex++;

  if (ride.dispatch.currentDriverIndex >= ride.dispatch.queue.length) {
    ride.status = "NO_DRIVER_FOUND";
    ride.dispatch.isDispatchCompleted = true;

    await ride.save();

    return;
  }

  await ride.save();

  await offerCurrentDriver(rideId);
};
