import { Schema, model } from "mongoose";

const businessSettingsSchema = new Schema(
  {
    pricing: {
      bike: {
        baseFare: {
          type: Number,
          required: true,
          min: 0,
          default: 30,
        },
        perKm: {
          type: Number,
          required: true,
          min: 0,
          default: 8,
        },
        perMinute: {
          type: Number,
          required: true,
          min: 0,
          default: 1,
        },
      },

      auto: {
        baseFare: {
          type: Number,
          required: true,
          min: 0,
          default: 40,
        },
        perKm: {
          type: Number,
          required: true,
          min: 0,
          default: 12,
        },
        perMinute: {
          type: Number,
          required: true,
          min: 0,
          default: 2,
        },
      },

      car: {
        baseFare: {
          type: Number,
          required: true,
          min: 0,
          default: 60,
        },
        perKm: {
          type: Number,
          required: true,
          min: 0,
          default: 15,
        },
        perMinute: {
          type: Number,
          required: true,
          min: 0,
          default: 3,
        },
      },
    },

    cancellation: {
      userFee: {
        type: Number,
        required: true,
        min: 0,
        default: 20,
      },

      driverPenalty: {
        type: Number,
        required: true,
        min: 0,
        default: 50,
      },

      freeCancellationBeforeDriverAccepts: {
        type: Boolean,
        required: true,
        default: true,
      },
    },

    driverMatching: {
      searchRadius: {
        type: Number,
        required: true,
        min: 100,
        default: 5000,
      },
    },

    peakHour: {
      enabled: {
        type: Boolean,
        required: true,
        default: false,
      },

      multiplier: {
        type: Number,
        required: true,
        min: 1,
        default: 1.5,
      },
    },

    trafficPricing: {
      enabled: {
        type: Boolean,
        required: true,
        default: false,
      },

      multiplier: {
        type: Number,
        required: true,
        min: 1,
        default: 1.2,
      },
    },
  },
  {
    timestamps: true,
  },
);

const BusinessSettingsModel = model("BusinessSettings", businessSettingsSchema);

export default BusinessSettingsModel;
