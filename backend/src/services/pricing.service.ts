import BusinessSettingsModel from "../modules/businessSettings/businessSettings.model.js";
import { VehicleType } from "../modules/ride/ride.types.js";
import { BusinessSettings } from "../modules/businessSettings/businessSettings.types.js";

interface CalculateFareInput {
  vehicleType: VehicleType;
  distance: number;
  duration: number;
}

export const calculateFare = async ({
  vehicleType,
  distance,
  duration,
}: CalculateFareInput): Promise<number> => {
  const settingsDocument = await BusinessSettingsModel.findOne();

  if (!settingsDocument) {
    throw new Error("Business settings not configured.");
  }

  const settings = settingsDocument.toObject() as BusinessSettings;

  const vehiclePricingMap = {
    Bike: settings.pricing.bike,
    Auto: settings.pricing.auto,
    Car: settings.pricing.car,
  };

  const pricing = vehiclePricingMap[vehicleType];

  const fare =
    pricing.baseFare + distance * pricing.perKm + duration * pricing.perMinute;

  let finalFare = fare;

  if (settings.peakHour.enabled) {
    finalFare *= settings.peakHour.multiplier;
  }

  if (settings.trafficPricing.enabled) {
    finalFare *= settings.trafficPricing.multiplier;
  }

  return Math.round(finalFare);
};
