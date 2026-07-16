import { Schema, model, InferSchemaType } from "mongoose";

const driverSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    profileImagePublicId: {
      type: String,
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    vehicleType: {
      type: String,
      enum: ["Bike", "Auto", "Car"],
      required: true,
    },

    licenseImage: {
      type: String,
      default: "",
    },

    licenseImagePublicId: {
      type: String,
      default: "",
    },

    rcImage: {
      type: String,
      default: "",
    },

    rcImagePublicId: {
      type: String,
      default: "",
    },

    vehicleImage: {
      type: String,
      default: "",
    },

    vehicleImagePublicId: {
      type: String,
      default: "",
    },

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },

      lastUpdated: {
        type: Date,
        default: null,
      },
    },

    isAvailable: {
      type: Boolean,
      default: false,
    },
    pendingPenalty: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

driverSchema.index({
  currentLocation: "2dsphere",
});

driverSchema.index({
  isAvailable: 1,
  vehicleType: 1,
});

driverSchema.index({
  isOnline: 1,
  isAvailable: 1,
});

export type Driver = InferSchemaType<typeof driverSchema>;

const DriverModel = model<Driver>("Driver", driverSchema);

export default DriverModel;
