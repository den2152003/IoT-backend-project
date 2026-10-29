import type { Request, Response } from "express";
import * as NodeService from "@/services/node.service";
import { ApiResponse } from "@/utils/ApiResponse";

export const create = async (req: Request, res: Response) => {
  const node = await NodeService.create(req.body);

  return ApiResponse.success(res, 201, "Tạo node thành công", node);
};

export const getList = async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const search = typeof req.query.search === "string" ? req.query.search : undefined;

  const gatewayId = typeof req.query.gatewayId === "string" ? req.query.gatewayId : undefined;

  const result = await NodeService.getList({
    page,
    limit,
    search,
    gatewayId
  });

  return ApiResponse.success(res, 200, "Lấy danh sách node", result);
};

export const getDetail = async (req: Request, res: Response) => {
  const node = await NodeService.getDetail(req.params.id as string);

  return ApiResponse.success(res, 200, "Lấy chi tiết node", node);
};

export const update = async (req: Request, res: Response) => {
  const node = await NodeService.update(req.params.id as string, req.body);

  return ApiResponse.success(res, 200, "Cập nhật thông tin node", node);
};

export const remove = async (req: Request, res: Response) => {
  const result = await NodeService.remove(req.params.id as string);

  return ApiResponse.success(res, 200, "Xóa node", result);
};

export const selectionByWifiName = async (req: Request, res: Response) => {
  const result = await NodeService.selectionByWifiName(req.query.wifiName as string);

  return ApiResponse.success(res, 200, "Lấy danh sách node", result);
};
