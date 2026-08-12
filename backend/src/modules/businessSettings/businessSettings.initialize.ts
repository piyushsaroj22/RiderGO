import BusinessSettingsModel from "./businessSettings.model.js";

export const initializeBusinessSettings = async (): Promise<void> => {
  const existingSettings = await BusinessSettingsModel.findOne();

  if (existingSettings) {
    return;
  }

  await BusinessSettingsModel.create({});

  console.log("Business settings initialized.");
};
