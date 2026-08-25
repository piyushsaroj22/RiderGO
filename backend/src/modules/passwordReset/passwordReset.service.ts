import crypto from "crypto";
import bcrypt from "bcrypt";

import AppError from "../../utils/AppError.js";
import env from "../../config/env.js";

import UserModel from "../user/user.model.js";
import DriverModel from "../driver/driver.model.js";
import AdminModel from "../admin/admin.model.js";

import PasswordResetModel from "./passwordReset.model.js";

import passwordResetEmailTemplate from "../../templates/passwordResetEmail.js";
import { sendMail } from "../../services/mail.service.js";

export type PasswordResetAccountType = "User" | "Driver" | "Admin";

const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000;

const getAccountByEmail = async (
  email: string,
  accountType: PasswordResetAccountType,
) => {
  switch (accountType) {
    case "User":
      return UserModel.findOne({ email });

    case "Driver":
      return DriverModel.findOne({ email });

    case "Admin":
      return AdminModel.findOne({ email });

    default:
      return null;
  }
};

const getAccountById = async (
  accountId: string,
  accountType: PasswordResetAccountType,
) => {
  switch (accountType) {
    case "User":
      return UserModel.findById(accountId);

    case "Driver":
      return DriverModel.findById(accountId);

    case "Admin":
      return AdminModel.findById(accountId).select("+password");

    default:
      return null;
  }
};

const getAccountName = (account: { name?: string; fullName?: string }) => {
  return account.name ?? account.fullName ?? "RiderGO User";
};

export const requestPasswordReset = async (
  email: string,
  accountType: PasswordResetAccountType,
): Promise<void> => {
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const account = await getAccountByEmail(email, accountType);

  /*
   * Never reveal whether the account exists.
   */
  if (!account) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

  await PasswordResetModel.deleteMany({
    accountId: account._id,
    accountType,
  });

  await PasswordResetModel.create({
    accountId: account._id,
    accountType,
    tokenHash,
    expiresAt,
  });

  const resetLink = `${env.CLIENT_URL}/reset-password/${accountType.toLowerCase()}/${rawToken}`;

  await sendMail({
    to: account.email,
    subject: "Reset your RiderGO password",
    html: passwordResetEmailTemplate(getAccountName(account), resetLink),
  });
};

export const resetPassword = async (
  token: string,
  newPassword: string,
  accountType: PasswordResetAccountType,
): Promise<void> => {
  if (!token || !newPassword) {
    throw new AppError("Token and new password are required", 400);
  }

  if (newPassword.length < 3) {
    throw new AppError("Password must be at least 3 characters", 400);
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const passwordReset = await PasswordResetModel.findOne({
    tokenHash,
    accountType,
  });

  if (!passwordReset) {
    throw new AppError("Invalid or expired password reset link", 400);
  }

  if (passwordReset.expiresAt < new Date()) {
    await PasswordResetModel.deleteOne({
      _id: passwordReset._id,
    });

    throw new AppError("Password reset link has expired", 400);
  }

  const account = await getAccountById(
    passwordReset.accountId.toString(),
    accountType,
  );

  if (!account) {
    await PasswordResetModel.deleteOne({
      _id: passwordReset._id,
    });

    throw new AppError(`${accountType} not found`, 404);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  account.password = hashedPassword;

  await account.save();

  /*
   * Reset token is single-use.
   */
  await PasswordResetModel.deleteOne({
    _id: passwordReset._id,
  });
};
