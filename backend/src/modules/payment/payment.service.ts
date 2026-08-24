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

  // Check if payment already exists
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

  /*
   * Reserve the payment in our database first.
   *
   * Because PaymentModel has a unique index on ride,
   * concurrent requests cannot create two payment records
   * for the same ride.
   */
  let payment;

  try {
    payment = await PaymentModel.create({
      ride: ride._id,
      rider: ride.rider,
      amount: ride.fare,
      currency: "INR",
      method: ride.paymentMethod,
      status: "CREATED",
      razorpayOrderId: "",
    });
  } catch (error: any) {
    // Another concurrent request created the payment first
    if (error?.code === 11000) {
      const concurrentPayment = await PaymentModel.findOne({
        ride: ride._id,
      });

      if (!concurrentPayment) {
        throw new AppError("Payment could not be initialized.", 500);
      }

      if (concurrentPayment.status === "PAID") {
        throw new AppError("Payment is already completed.", 400);
      }

      return {
        success: true,
        message: "Existing payment found.",
        data: {
          paymentId: concurrentPayment._id.toString(),
          rideId: ride._id.toString(),
          amount: concurrentPayment.amount,
          currency: concurrentPayment.currency,
          method: concurrentPayment.method,
          status: concurrentPayment.status as PaymentStatus,
          razorpayOrderId: concurrentPayment.razorpayOrderId,
          razorpayKeyId: env.RAZORPAY_KEY_ID,
        },
      };
    }

    throw error;
  }

  // Create Razorpay order only after local payment reservation
  const order = await razorpay.orders.create({
    amount: ride.fare * 100,
    currency: "INR",
    receipt: `ride_${ride._id.toString()}`,
  });

  payment.razorpayOrderId = order.id;

  await payment.save();

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

  const session = await PaymentModel.startSession();

  try {
    session.startTransaction();

    const payment = await PaymentModel.findOne({
      razorpayOrderId,
    }).session(session);

    if (!payment) {
      throw new AppError("Payment not found.", 404);
    }

    if (payment.rider.toString() !== riderId) {
      throw new AppError("Unauthorized.", 403);
    }

    if (payment.status === "PAID") {
      throw new AppError("Payment is already verified.", 400);
    }

    const ride = await RideModel.findById(payment.ride).session(session);

    if (!ride) {
      throw new AppError("Ride not found.", 404);
    }

    if (ride.rider.toString() !== riderId) {
      throw new AppError("Unauthorized.", 403);
    }

    if (ride.status !== "COMPLETED") {
      throw new AppError(
        "Payment can only be verified for a completed ride.",
        400,
      );
    }

    if (ride.paymentStatus === "PAID") {
      throw new AppError("Ride payment is already completed.", 400);
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

    await payment.save({ session });

    ride.paymentStatus = "PAID";

    await ride.save({ session });

    await session.commitTransaction();

    return {
      success: true,
      message: "Payment verified successfully.",
      data: {
        paymentId: payment._id.toString(),
        rideId: ride._id.toString(),
        paymentStatus: "PAID",
      },
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
