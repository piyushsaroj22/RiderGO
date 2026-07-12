import { Schema, model, InferSchemaType } from "mongoose";

const emailVerificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
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

export type EmailVerification = InferSchemaType<typeof emailVerificationSchema>;

const EmailVerificationModel = model<EmailVerification>(
  "EmailVerification",
  emailVerificationSchema,
);

export default EmailVerificationModel;
