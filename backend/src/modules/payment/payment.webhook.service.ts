import crypto from "crypto";
import AppError from "../../utils/AppError.js";
import env from "../../config/env.js";
import PaymentModel from "./payment.model.js";
import PaymentWebhookEventModel from "./paymentWebhookEvent.model.js";
import RideModel from "../ride/ride.model.js";

interface RazorpayPaymentEntity {
  id: string;
  order_id: string;
}

interface RazorpayWebhookPayload {
  event: string;
  payload?: {
    payment?: {
      entity?: RazorpayPaymentEntity;
    };
    order?: {
      entity?: {
        id: string;
      };
    };
  };
}

export const processRazorpayWebhook = async (
  rawBody: Buffer,
  signature: string,
  eventId: string,
): Promise<void> => {
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new AppError("Invalid Razorpay webhook signature.", 400);
  }

  if (!eventId) {
    throw new AppError("Missing Razorpay event ID.", 400);
  }

  const alreadyProcessed = await PaymentWebhookEventModel.findOne({
    eventId,
  });

  if (alreadyProcessed) {
    return;
  }

  const payload = JSON.parse(
    rawBody.toString("utf-8"),
  ) as RazorpayWebhookPayload;

  const event = payload.event;

  if (
    event !== "payment.captured" &&
    event !== "payment.failed" &&
    event !== "order.paid"
  ) {
    await PaymentWebhookEventModel.create({
      eventId,
      event,
    });

    return;
  }

  let razorpayOrderId: string | undefined;
  let razorpayPaymentId: string | undefined;

  if (event === "payment.captured" || event === "payment.failed") {
    const paymentEntity = payload.payload?.payment?.entity;

    razorpayOrderId = paymentEntity?.order_id;
    razorpayPaymentId = paymentEntity?.id;
  }

  if (event === "order.paid") {
    razorpayOrderId = payload.payload?.order?.entity?.id;
  }

  if (!razorpayOrderId) {
    throw new AppError("Razorpay order ID not found in webhook payload.", 400);
  }

  const payment = await PaymentModel.findOne({
    razorpayOrderId,
  });

  if (!payment) {
    throw new AppError("Payment record not found.", 404);
  }

  if (event === "payment.captured" || event === "order.paid") {
    payment.status = "PAID";
    payment.paidAt = payment.paidAt ?? new Date();

    if (razorpayPaymentId) {
      payment.razorpayPaymentId = razorpayPaymentId;
    }

    await payment.save();

    await RideModel.findByIdAndUpdate(payment.ride, {
      paymentStatus: "PAID",
    });
  }

  if (event === "payment.failed") {
    payment.status = "FAILED";

    if (razorpayPaymentId) {
      payment.razorpayPaymentId = razorpayPaymentId;
    }

    await payment.save();

    await RideModel.findByIdAndUpdate(payment.ride, {
      paymentStatus: "FAILED",
    });
  }

  await PaymentWebhookEventModel.create({
    eventId,
    event,
  });
};
