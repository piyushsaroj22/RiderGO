import jwt, { SignOptions } from "jsonwebtoken";
import env from "../config/env.js";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
};
