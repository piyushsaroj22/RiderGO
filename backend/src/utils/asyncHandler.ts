// import { Request, Response, NextFunction, RequestHandler } from "express";

// const asyncHandler =
//   (handler: RequestHandler): RequestHandler =>
//   (req: Request, res: Response, next: NextFunction) =>
//     Promise.resolve(handler(req, res, next)).catch(next);

// export default asyncHandler;

import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";
import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandler<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs,
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
) => Promise<unknown>;

const asyncHandler = <
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs,
>(
  handler: AsyncHandler<P, ResBody, ReqBody, ReqQuery>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export default asyncHandler;
