import { HydratedDocument } from "mongoose";
import { Request } from "express";
import UserModel from "../modules/user/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<
        typeof UserModel extends import("mongoose").Model<infer T> ? T : never
      >;
    }
  }
}

export {};
