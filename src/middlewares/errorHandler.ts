/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
// import logger from "@/cores/logger";
// import { cleanupUploadedFiles } from "@/helper/cleanupUploadedFiles";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NewableFunction
): void => {
  // const filesToDelete = req.files || req.file;
  // if (filesToDelete) {
  //   cleanupUploadedFiles(filesToDelete);
  // }
  // logger("ERROR", err);

  // Nếu là lỗi có code riêng (ví dụ lỗi 400 do bạn chủ động throw)
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    code: statusCode,
    status: false,
    message,
    data: null
  });
};

export default errorHandler;