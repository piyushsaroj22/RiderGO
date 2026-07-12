import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(handler(req, res, next)).catch(next);

export default asyncHandler;
