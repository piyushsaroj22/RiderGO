import { Request, Response } from "express";

export const healthCheck = (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "RiderGO API is running",
  });
};
