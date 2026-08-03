import { Schema, model, InferSchemaType, HydratedDocument } from "mongoose";

const appealSchema = new Schema(
  {
    driver: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },

    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    adminResponse: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

appealSchema.index({
  driver: 1,
  status: 1,
});

appealSchema.index({
  status: 1,
  createdAt: -1,
});

appealSchema.index({
  admin: 1,
});

export type Appeal = InferSchemaType<typeof appealSchema>;
export type AppealDocument = HydratedDocument<Appeal>;

const AppealModel = model<Appeal>("Appeal", appealSchema);

export default AppealModel;
