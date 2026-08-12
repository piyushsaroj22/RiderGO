import DriverModel from "../modules/driver/driver.model.js";
import BusinessSettingsModel from "../modules/businessSettings/businessSettings.model.js";
import { BusinessSettings } from "../modules/businessSettings/businessSettings.types.js";

interface FindNearbyDriversInput {
  latitude: number;
  longitude: number;
  maxDistance?: number;
}

export const findNearbyDrivers = async ({
  latitude,
  longitude,
  maxDistance,
}: FindNearbyDriversInput) => {
  let searchRadius = maxDistance;

  if (searchRadius === undefined) {
    const settingsDocument = await BusinessSettingsModel.findOne();

    if (!settingsDocument) {
      throw new Error("Business settings not configured.");
    }

    const settings = settingsDocument.toObject() as BusinessSettings;

    searchRadius = settings.driverMatching.searchRadius;
  }

  return DriverModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        distanceField: "distance",
        spherical: true,
        maxDistance: searchRadius,
        query: {
          isOnline: true,
          isAvailable: true,
          verificationStatus: "APPROVED",
          isEmailVerified: true,
        },
      },
    },
  ]);
};
