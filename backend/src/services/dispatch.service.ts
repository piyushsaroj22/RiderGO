import { HydratedDocument } from "mongoose";
import AppError from "../utils/AppError.js";
import RideModel from "../modules/ride/ride.model.js";
import DriverModel, { Driver } from "../modules/driver/driver.model.js";
import { findNearbyDrivers } from "./driverMatching.service.js";
import { emitRideOffer } from "../sockets/socket.events.js";
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

  if (
    ride.status !== "SEARCHING" ||
    ride.dispatch.isDispatchCompleted ||
    ride.driver
  ) {
    return;
  }

  if (ride.dispatch.currentDriverIndex >= ride.dispatch.queue.length) {
    ride.status = "NO_DRIVER_FOUND";
    ride.dispatch.isDispatchCompleted = true;

    await ride.save();

    return;
  }

  const driverId = ride.dispatch.queue[ride.dispatch.currentDriverIndex];

  await createRideOffer(rideId, driverId.toString());

  emitRideOffer(driverId.toString(), {
    rideId: ride._id.toString(),
    riderId: ride.rider.toString(),

    pickup: {
      address: ride.pickup.address,
      latitude: ride.pickup.latitude,
      longitude: ride.pickup.longitude,
    },

    destination: {
      address: ride.destination.address,
      latitude: ride.destination.latitude,
      longitude: ride.destination.longitude,
    },

    vehicleType: ride.vehicleType,

    fare: ride.fare,
    distance: ride.distance,
    duration: ride.duration,
  });
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

  if (ride.status !== "SEARCHING") {
    throw new AppError("Ride is no longer available", 409);
  }

  if (ride.driver) {
    throw new AppError("Ride already has a driver", 409);
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
  const ride = await RideModel.findOneAndUpdate(
    {
      _id: rideId,
      status: "SEARCHING",
      "dispatch.isDispatchCompleted": false,
      "dispatch.isDispatchInProgress": false,
    },
    {
      $set: {
        "dispatch.isDispatchInProgress": true,
      },
    },
    {
      new: true,
    },
  );

  // Another dispatch operation is already handling this ride
  if (!ride) {
    return;
  }

  try {
    const nextDriverIndex = ride.dispatch.currentDriverIndex + 1;

    if (nextDriverIndex >= ride.dispatch.queue.length) {
      ride.status = "NO_DRIVER_FOUND";
      ride.dispatch.isDispatchCompleted = true;
      ride.dispatch.isDispatchInProgress = false;

      await ride.save();

      return;
    }

    ride.dispatch.currentDriverIndex = nextDriverIndex;

    await ride.save();

    await offerCurrentDriver(rideId);
  } finally {
    await RideModel.findByIdAndUpdate(rideId, {
      $set: {
        "dispatch.isDispatchInProgress": false,
      },
    });
  }
};
