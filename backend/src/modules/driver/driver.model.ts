import { Schema, model, InferSchemaType, HydratedDocument } from "mongoose";

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

    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    blockReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    blockedAt: {
      type: Date,
      default: null,
    },

    blockedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
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

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalRatings: {
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
export type DriverDocument = HydratedDocument<Driver>;

const DriverModel = model<Driver>("Driver", driverSchema);

export default DriverModel;
