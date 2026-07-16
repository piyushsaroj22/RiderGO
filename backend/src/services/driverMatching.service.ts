import DriverModel from "../modules/driver/driver.model.js";

interface FindNearbyDriversInput {
  latitude: number;
  longitude: number;
  maxDistance?: number;
}

export const findNearbyDrivers = async ({
  latitude,
  longitude,
  maxDistance = 500000, // 5 KM
}: FindNearbyDriversInput) => {
  return DriverModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        distanceField: "distance",
        spherical: true,
        maxDistance,
        query: {
          isOnline: true,
          isAvailable: true,
          isApproved: true,
          isEmailVerified: true,
        },
      },
    },
  ]);
};
