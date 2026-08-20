import { PaymentMethod } from "../ride/ride.types.js";

export type PaymentStatus = "CREATED" | "PAID" | "FAILED";

export interface CreatePaymentInput {
  rideId: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    rideId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    status: PaymentStatus;
    razorpayOrderId: string;
    razorpayKeyId: string;
  };
}

export interface VerifyPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    rideId: string;
    paymentStatus: "PAID";
  };
}
