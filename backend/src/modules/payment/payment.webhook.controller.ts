import { Request, Response } from "express";
import { processRazorpayWebhook } from "./payment.webhook.service.js";

export const razorpayWebhookController = async (
  req: Request,
  res: Response,
) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const eventId = req.headers["x-razorpay-event-id"];

    if (typeof signature !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay webhook signature.",
      });
    }

    if (typeof eventId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay event ID.",
      });
    }

    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook body.",
      });
    }

    await processRazorpayWebhook(req.body, signature, eventId);

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully.",
    });
  } catch (error) {
    console.error("Razorpay webhook failed:", error);

    return res.status(400).json({
      success: false,
      message: "Webhook processing failed.",
    });
  }
};
