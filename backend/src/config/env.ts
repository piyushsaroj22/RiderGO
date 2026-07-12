import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables");
}

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined in the environment variables");
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

if (!process.env.SMTP_HOST) {
  throw new Error("SMTP_HOST is not defined in the environment variables");
}

if (!process.env.SMTP_PORT) {
  throw new Error("SMTP_PORT is not defined in the environment variables");
}

if (!process.env.SMTP_USER) {
  throw new Error("SMTP_USER is not defined in the environment variables");
}

if (!process.env.SMTP_PASS) {
  throw new Error("SMTP_PASS is not defined in the environment variables");
}

if (!process.env.SMTP_FROM) {
  throw new Error("SMTP_FROM is not defined in the environment variables");
}

if (!process.env.APP_URL) {
  throw new Error("APP_URL is not defined in the environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

if (!process.env.JWT_EXPIRES_IN) {
  throw new Error("JWT_EXPIRES_IN is not defined in the environment variables");
}

if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL is not defined in the environment variables");
}

const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,

  APP_URL: process.env.APP_URL,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  CLIENT_URL: process.env.CLIENT_URL,
};

export default env;
