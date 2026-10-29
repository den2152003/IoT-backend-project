import type { Request, Response } from "express";
import { SensorDataService } from "@/services";
import { ApiResponse, throwError } from "@/utils/ApiResponse";
import { ESensorDataType } from "@/shared-types/Form-data/SensorData";

export const getList = async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const nodeId = typeof req.query.nodeId === "string" ? req.query.nodeId : undefined;

  const result = await SensorDataService.getList({
    page,
    limit,
    nodeId
  });

  return ApiResponse.success(res, 200, "Lấy danh sách cảm biến thành công", result);
};

export const getStatistics = async (req: Request, res: Response) => {
  const nodeId = typeof req.query.nodeId === "string" ? req.query.nodeId : "";

  const type = typeof req.query.type === "string" ? req.query.type : "";

  if (!nodeId) {
    return throwError(400, "nodeId là bắt buộc");
  }

  if (!["day", "week", "month"].includes(type)) {
    return throwError(400, "type phải là day, week hoặc month");
  }

  const result = await SensorDataService.getStatistics({
    nodeId,
    type: type as ESensorDataType
  });

  return ApiResponse.success(res, 200, "Lấy thống kê cảm biến thành công", result);
};
