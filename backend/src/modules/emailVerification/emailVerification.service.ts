import crypto from "crypto";
import env from "../../config/env.js";
import EmailVerificationModel from "./emailVerification.model.js";
import verificationEmailTemplate from "../../templates/verificationEmail.js";
import { sendMail } from "../../services/mail.service.js";

export const sendVerificationEmail = async (
  userId: string,
  name: string,
  email: string,
): Promise<void> => {
  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await EmailVerificationModel.deleteMany({
    user: userId,
  });

  await EmailVerificationModel.create({
    user: userId,
    token,
    expiresAt,
  });

  const verificationLink = `${env.APP_URL}/api/auth/verify-email/${token}`;

  await sendMail({
    to: email,
    subject: "Verify your RiderGO account",
    html: verificationEmailTemplate(name, verificationLink),
  });
};
