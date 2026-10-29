import type { Request, Response } from "express";
import * as ProjectService from "@/services/project.service";
import { ApiResponse } from "@/utils/ApiResponse";

export const create = async (req: Request, res: Response) => {
  const userId = req.token.userId;

  const project = await ProjectService.create(req.body, userId);

  return ApiResponse.success(res, 201, "Tạo project thành công", project);
};

export const getList = async (req: Request, res: Response)=> {
  const level = req.token.level;
  const userId = req.token.userId;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const search = typeof req.query.search === "string" ? req.query.search : undefined;

  const result = await ProjectService.getList({
    level,
    userId,
    page,
    limit,
    search
  });

  return ApiResponse.success(res, 200, "Lấy danh sách project", result);
};

export const getDetail = async (req: Request, res: Response) => {
  const project = await ProjectService.getDetail(req.params.id as string);

  return ApiResponse.success(res, 200, "Lấy chi tiết project", project);
};

export const update = async (req: Request, res: Response) => {
  const userId = req.token.userId;

  const project = await ProjectService.update(req.params.id as string, req.body, userId);

  return ApiResponse.success(res, 200, "Cập nhật project thông tin", project);
};

export const remove = async (req: Request, res: Response) => {
  const result = await ProjectService.remove(req.params.id as string);

  return ApiResponse.success(res, 200, "Xóa project", result);
};

export const selectionByWifiName = async (req: Request, res: Response) => {
  const result = await ProjectService.selectionByWifiName(req.query.wifiName as string);

  return ApiResponse.success(res, 200, "Lấy danh sách project", result);
};