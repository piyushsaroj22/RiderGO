import AppError from "../../utils/AppError.js";
import RideModel from "../ride/ride.model.js";
import PaymentModel from "./payment.model.js";
import razorpay from "../../config/razorpay.js";
import env from "../../config/env.js";
import crypto from "crypto";
import {
  CreatePaymentResponse,
  PaymentStatus,
  VerifyPaymentInput,
  VerifyPaymentResponse,
} from "./payment.types.js";

export const createPayment = async (
  riderId: string,
  rideId: string,
): Promise<CreatePaymentResponse> => {
  const ride = await RideModel.findById(rideId);

  if (!ride) {
    throw new AppError("Ride not found", 404);
  }

  if (ride.rider.toString() !== riderId) {
    throw new AppError("Unauthorized", 403);
  }

  if (ride.paymentMethod === "Cash") {
    throw new AppError("Cash rides do not require online payment.", 400);
  }

  if (ride.paymentStatus === "PAID") {
    throw new AppError("Ride payment is already completed.", 400);
  }

  if (ride.status !== "COMPLETED") {
    throw new AppError(
      "Payment can only be initiated after ride completion.",
      400,
    );
  }

  const existingPayment = await PaymentModel.findOne({
    ride: ride._id,
  });

  if (existingPayment) {
    if (existingPayment.status === "PAID") {
      throw new AppError("Payment is already completed.", 400);
    }

    return {
      success: true,
      message: "Existing payment found.",
      data: {
        paymentId: existingPayment._id.toString(),
        rideId: ride._id.toString(),
        amount: existingPayment.amount,
        currency: existingPayment.currency,
        method: existingPayment.method,
        status: existingPayment.status as PaymentStatus,
        razorpayOrderId: existingPayment.razorpayOrderId,
        razorpayKeyId: env.RAZORPAY_KEY_ID,
      },
    };
  }

  const order = await razorpay.orders.create({
    amount: ride.fare * 100,
    currency: "INR",
    receipt: `ride_${ride._id.toString()}`,
  });

  const payment = await PaymentModel.create({
    ride: ride._id,
    rider: ride.rider,
    amount: ride.fare,
    currency: "INR",
    method: ride.paymentMethod,
    status: "CREATED",
    razorpayOrderId: order.id,
  });

  return {
    success: true,
    message: "Payment order created successfully.",
    data: {
      paymentId: payment._id.toString(),
      rideId: ride._id.toString(),
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status as PaymentStatus,
      razorpayOrderId: order.id,
      razorpayKeyId: env.RAZORPAY_KEY_ID,
    },
  };
};

export const verifyPayment = async (
  riderId: string,
  input: VerifyPaymentInput,
): Promise<VerifyPaymentResponse> => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

  const payment = await PaymentModel.findOne({
    razorpayOrderId,
  });

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  if (payment.rider.toString() !== riderId) {
    throw new AppError("Unauthorized.", 403);
  }

  if (payment.status === "PAID") {
    throw new AppError("Payment is already verified.", 400);
  }

  const generatedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const generatedSignatureBuffer = Buffer.from(generatedSignature);
  const receivedSignatureBuffer = Buffer.from(razorpaySignature);

  if (
    generatedSignatureBuffer.length !== receivedSignatureBuffer.length ||
    !crypto.timingSafeEqual(generatedSignatureBuffer, receivedSignatureBuffer)
  ) {
    throw new AppError("Invalid payment signature.", 400);
  }

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = "PAID";
  payment.paidAt = new Date();

  await payment.save();

  const ride = await RideModel.findById(payment.ride);

  if (!ride) {
    throw new AppError("Ride not found.", 404);
  }

  ride.paymentStatus = "PAID";

  await ride.save();

  return {
    success: true,
    message: "Payment verified successfully.",
    data: {
      paymentId: payment._id.toString(),
      rideId: ride._id.toString(),
      paymentStatus: "PAID",
    },
  };
};
