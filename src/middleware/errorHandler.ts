import { Request, Response, NextFunction } from "express";
import { Error } from "../types/types"
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(error.status || 500).json({
    massage: error.message
  })
};
