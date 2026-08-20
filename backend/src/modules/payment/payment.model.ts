import { Schema, model, InferSchemaType } from "mongoose";

const paymentSchema = new Schema(
  {
    ride: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
      unique: true,
    },

    rider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      required: true,
    },

    method: {
      type: String,
      enum: ["Cash", "UPI", "Card"],
      required: true,
    },

    status: {
      type: String,
      enum: ["CREATED", "PAID", "FAILED"],
      default: "CREATED",
      required: true,
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index({
  rider: 1,
  createdAt: -1,
});

paymentSchema.index({
  razorpayOrderId: 1,
});

paymentSchema.index({
  razorpayPaymentId: 1,
});

export type Payment = InferSchemaType<typeof paymentSchema>;

const PaymentModel = model<Payment>("Payment", paymentSchema);

export default PaymentModel;
