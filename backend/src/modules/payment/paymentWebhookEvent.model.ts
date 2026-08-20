import { Schema, model } from "mongoose";

const paymentWebhookEventSchema = new Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    event: {
      type: String,
      required: true,
    },

    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const PaymentWebhookEventModel = model(
  "PaymentWebhookEvent",
  paymentWebhookEventSchema,
);

export default PaymentWebhookEventModel;
