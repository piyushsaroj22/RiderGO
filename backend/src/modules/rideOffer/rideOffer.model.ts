import { Schema, model, InferSchemaType } from "mongoose";

const rideOfferSchema = new Schema(
  {
    ride: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },

    driver: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"],
      default: "PENDING",
      index: true,
    },

    offeredAt: {
      type: Date,
      default: Date.now,
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Driver ka pending offer jaldi mile
rideOfferSchema.index({
  driver: 1,
  status: 1,
});

// Ride ke saare offers jaldi fetch hon
rideOfferSchema.index({
  ride: 1,
});

// Pending offer lookup
rideOfferSchema.index({
  ride: 1,
  driver: 1,
  status: 1,
});

// Expired offer cleanup job
rideOfferSchema.index({
  expiresAt: 1,
});

// One active offer per driver for one ride
rideOfferSchema.index({ ride: 1, driver: 1 }, { unique: true });

export type RideOffer = InferSchemaType<typeof rideOfferSchema>;

const RideOfferModel = model<RideOffer>("RideOffer", rideOfferSchema);

export default RideOfferModel;
