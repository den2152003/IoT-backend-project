import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "@/utils/webToken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy access token"
    });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Access token không hợp lệ"
    });
  }

  try {
    const payload = verifyAccessToken(token);

    req.token = payload;

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Access token không hợp lệ hoặc đã hết hạn"
    });
  }
};
