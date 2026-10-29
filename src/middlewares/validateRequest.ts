import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { throwError } from "@/utils/ApiResponse";

const validateRequest = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return throwError(400, errors.array()[0].msg);
  }

  next();
};

export default validateRequest;
