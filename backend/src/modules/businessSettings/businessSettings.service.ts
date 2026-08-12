import AppError from "../../utils/AppError.js";
import BusinessSettingsModel from "./businessSettings.model.js";
import {
  BusinessSettings,
  GetBusinessSettingsResponse,
  UpdateBusinessSettingsInput,
  UpdateBusinessSettingsResponse,
} from "./businessSettings.types.js";

const getOrCreateBusinessSettings = async () => {
  let settings = await BusinessSettingsModel.findOne();

  if (!settings) {
    settings = await BusinessSettingsModel.create({});
  }

  return settings;
};

const getBusinessSettingsDocument = async () => {
  const settings = await BusinessSettingsModel.findOne();

  if (!settings) {
    throw new AppError("Business settings are not initialized.", 500);
  }

  return settings;
};

export const getBusinessSettings =
  async (): Promise<GetBusinessSettingsResponse> => {
    const settings = await getBusinessSettingsDocument();

    return {
      success: true,
      data: settings.toObject() as BusinessSettings,
    };
  };

export const updateBusinessSettings = async (
  input: UpdateBusinessSettingsInput,
): Promise<UpdateBusinessSettingsResponse> => {
  const settings = await getBusinessSettingsDocument();

  const current = settings.toObject() as BusinessSettings;

  const updatedSettings: BusinessSettings = {
    ...current,

    pricing: {
      bike: {
        ...current.pricing.bike,
        ...input.pricing?.bike,
      },

      auto: {
        ...current.pricing.auto,
        ...input.pricing?.auto,
      },

      car: {
        ...current.pricing.car,
        ...input.pricing?.car,
      },
    },

    cancellation: {
      ...current.cancellation,
      ...input.cancellation,
    },

    driverMatching: {
      ...current.driverMatching,
      ...input.driverMatching,
    },

    peakHour: {
      ...current.peakHour,
      ...input.peakHour,
    },

    trafficPricing: {
      ...current.trafficPricing,
      ...input.trafficPricing,
    },
  };

  validateBusinessSettings(updatedSettings);

  settings.set("pricing", updatedSettings.pricing);
  settings.set("cancellation", updatedSettings.cancellation);
  settings.set("driverMatching", updatedSettings.driverMatching);
  settings.set("peakHour", updatedSettings.peakHour);
  settings.set("trafficPricing", updatedSettings.trafficPricing);

  await settings.save();

  return {
    success: true,
    message: "Business settings updated successfully.",
    data: settings.toObject() as BusinessSettings,
  };
};

const validateBusinessSettings = (settings: BusinessSettings): void => {
  const vehiclePricing = [
    settings.pricing.bike,
    settings.pricing.auto,
    settings.pricing.car,
  ];

  for (const pricing of vehiclePricing) {
    if (pricing.baseFare < 0 || pricing.perKm < 0 || pricing.perMinute < 0) {
      throw new AppError("Pricing values cannot be negative.", 400);
    }
  }

  if (settings.cancellation.userFee < 0) {
    throw new AppError("User cancellation fee cannot be negative.", 400);
  }

  if (settings.cancellation.driverPenalty < 0) {
    throw new AppError("Driver cancellation penalty cannot be negative.", 400);
  }

  if (settings.driverMatching.searchRadius < 100) {
    throw new AppError(
      "Driver search radius must be at least 100 meters.",
      400,
    );
  }

  if (settings.peakHour.multiplier < 1) {
    throw new AppError("Peak hour multiplier must be at least 1.", 400);
  }

  if (settings.trafficPricing.multiplier < 1) {
    throw new AppError("Traffic pricing multiplier must be at least 1.", 400);
  }
};
