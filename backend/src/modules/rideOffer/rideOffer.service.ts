import env from "../../config/env.js";
import RideOfferModel from "./rideOffer.model.js";

export const createRideOffer = async (
  rideId: string,
  driverId: string,
  timeoutInSeconds = 10,
) => {
  const now = new Date();

  const expiresAt = new Date(now.getTime() + timeoutInSeconds * 1000);

  const offer = await RideOfferModel.create({
    ride: rideId,
    driver: driverId,
    offeredAt: now,
    expiresAt,
  });

  return offer;
};

export const getPendingRideOffer = async (rideId: string, driverId: string) => {
  return RideOfferModel.findOne({
    ride: rideId,
    driver: driverId,
    status: "PENDING",
  });
};

export const getAcceptedRideOffer = async (
  rideId: string,
  driverId: string,
) => {
  return RideOfferModel.findOne({
    ride: rideId,
    driver: driverId,
    status: "ACCEPTED",
  });
};

export const getRejectedRideOffer = async (
  rideId: string,
  driverId: string,
) => {
  return RideOfferModel.findOne({
    ride: rideId,
    driver: driverId,
    status: "REJECTED",
  });
};

export const getRideOffers = async (rideId: string) => {
  return RideOfferModel.find({
    ride: rideId,
  }).sort({
    createdAt: 1,
  });
};

export const acceptRideOffer = async (rideId: string, driverId: string) => {
  return RideOfferModel.findOneAndUpdate(
    {
      ride: rideId,
      driver: driverId,
      status: "PENDING",
    },
    {
      status: "ACCEPTED",
      respondedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

export const rejectRideOffer = async (rideId: string, driverId: string) => {
  return RideOfferModel.findOneAndUpdate(
    {
      ride: rideId,
      driver: driverId,
      status: "PENDING",
    },
    {
      status: "REJECTED",
      respondedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

export const expireRideOffer = async (rideId: string, driverId: string) => {
  return RideOfferModel.findOneAndUpdate(
    {
      ride: rideId,
      driver: driverId,
      status: "PENDING",
    },
    {
      status: "EXPIRED",
      respondedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

export const claimExpiredRideOffer = async () => {
  return RideOfferModel.findOneAndUpdate(
    {
      status: "PENDING",
      expiresAt: {
        $lte: new Date(),
      },
    },
    {
      status: "EXPIRED",
      respondedAt: new Date(),
    },
    {
      new: true,
      sort: {
        expiresAt: 1,
      },
    },
  );
};

export const expireAllRideOffers = async (rideId: string) => {
  return RideOfferModel.updateMany(
    {
      ride: rideId,
      status: "PENDING",
    },
    {
      status: "EXPIRED",
      respondedAt: new Date(),
    },
  );
};

export const deleteRideOffers = async (rideId: string) => {
  return RideOfferModel.deleteMany({
    ride: rideId,
  });
};
