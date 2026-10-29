import { Response } from "express";

export const ApiResponse = {
  success: <T>(
    res: Response,
    code: number = 200,
    message: string = "Success",
    data: T | null = null
  ) => {
    return res.status(code).json({
      code,
      status: true,
      message,
      data
    });
  },

  error: (res: Response, code: number = 400, message: string = "Error", data: any = null) => {
    return res.status(code).json({
      code,
      status: false,
      message,
      data
    });
  }
};

type TStatusCode = 400 | 401 | 402 | 403 | 404 | 406 | 408 | 409 | 410 | 429 | 500;

export const throwError = (statusCode: TStatusCode, message: string) => {
  // Ném lỗi có message + code tuỳ chỉnh
  const error = new Error(message);
  // @ts-ignore
  error.statusCode = statusCode;
  throw error;
};
