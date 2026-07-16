import { Schema, model, InferSchemaType } from "mongoose";

const locationSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const dispatchSchema = new Schema(
  {
    queue: [
      {
        type: Schema.Types.ObjectId,
        ref: "Driver",
      },
    ],

    currentDriverIndex: {
      type: Number,
      default: 0,
      required: true,
    },

    isDispatchCompleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const rideSchema = new Schema(
  {
    rider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driver: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    pickup: {
      type: locationSchema,
      required: true,
    },

    destination: {
      type: locationSchema,
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["Bike", "Auto", "Car"],
      required: true,
    },

    fare: {
      type: Number,
      required: true,
      min: 0,
    },

    distance: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "SEARCHING",
        "NO_DRIVER_FOUND",
        "DRIVER_ASSIGNED",
        "DRIVER_ARRIVED",
        "OTP_VERIFIED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "SEARCHING",
    },

    dispatch: {
      type: dispatchSchema,
      default: () => ({
        queue: [],
        currentDriverIndex: 0,
        isDispatchCompleted: false,
      }),
    },

    otp: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    cancelledBy: {
      type: String,
      enum: ["User", "Driver", "Admin"],
      default: null,
    },

    cancellationFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: "",
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Rider ride history
rideSchema.index({
  rider: 1,
  createdAt: -1,
});

// Driver ride history
rideSchema.index({
  driver: 1,
  createdAt: -1,
});

// Driver active ride lookup
rideSchema.index({
  driver: 1,
  status: 1,
});

// Rider active ride lookup
rideSchema.index({
  rider: 1,
  status: 1,
});

// Status based queries
rideSchema.index({
  status: 1,
});

export type Ride = InferSchemaType<typeof rideSchema>;

const RideModel = model<Ride>("Ride", rideSchema);

export default RideModel;
