import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import healthRoutes from "./modules/health/health.routes.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/health", healthRoutes);

export default app;
