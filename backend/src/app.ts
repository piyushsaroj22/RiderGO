import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import healthRoutes from "./modules/health/health.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import userRoutes from "./modules/user/user.routes.js";
import driverRoutes from "./modules/driver/driver.routes.js";
import rideRoutes from "./modules/ride/ride.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import appealRoutes from "./modules/appeal/appeal.routes.js";
import businessSettingsRoutes from "./modules/businessSettings/businessSettings.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import { razorpayWebhookController } from "./modules/payment/payment.webhook.controller.js";

const app = express();

app.use(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
  }),
  razorpayWebhookController,
);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appeals", appealRoutes);
app.use("/api/business-settings", businessSettingsRoutes);
app.use("/api/payments", paymentRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
