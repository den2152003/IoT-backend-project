import type { NextFunction, Request, Response } from "express";

import { EUserLevel } from "@/shared-types/Common/role";

export const authorize = (...allowedLevels: EUserLevel[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.token) {
      return res.status(401).json({
        success: false,
        message: "Chưa xác thực"
      });
    }

    if (!allowedLevels.includes(req.token.level)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện thao tác này"
      });
    }

    return next();
  };
};
