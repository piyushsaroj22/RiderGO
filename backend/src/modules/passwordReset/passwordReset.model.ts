import { Schema, model, InferSchemaType } from "mongoose";

const passwordResetSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    accountType: {
      type: String,
      enum: ["User", "Driver", "Admin"],
      required: true,
    },

    tokenHash: {
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

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

passwordResetSchema.index({ accountId: 1, accountType: 1 }, { unique: true });

export type PasswordReset = InferSchemaType<typeof passwordResetSchema>;

const PasswordResetModel = model<PasswordReset>(
  "PasswordReset",
  passwordResetSchema,
);

export default PasswordResetModel;
