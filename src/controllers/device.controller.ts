import type { Request, Response } from "express";
import { DeviceService } from "@/services";
import { ApiResponse, throwError } from "@/utils/ApiResponse";
import { DeviceFormData } from "@/shared-types/Form-data";

export const create = async (req: Request, res: Response) => {
  const formData = req.body as DeviceFormData.ICreateDevice;

  const device = await DeviceService.create(formData);

  return ApiResponse.success(res, 201, "Tạo device thành công", device);
};

export const getList = async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const search = typeof req.query.search === "string" ? req.query.search : undefined;

  const nodeId = typeof req.query.nodeId === "string" ? req.query.nodeId : undefined;

  const result = await DeviceService.getList({
    page,
    limit,
    search,
    nodeId
  });

  return ApiResponse.success(res, 200, "Lấy danh sách device thành công", result);
};

export const getDetail = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const device = await DeviceService.getDetail(id);

  return ApiResponse.success(res, 200, "Lấy chi tiết device thành công", device);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const formData = req.body as DeviceFormData.IUpdateDevice;

  const device = await DeviceService.update(id, formData);

  return ApiResponse.success(res, 200, "Cập nhật device thành công", device);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const result = await DeviceService.remove(id);

  return ApiResponse.success(res, 200, "Xóa device thành công", result);
};

export const control = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const { turn } = req.body as DeviceFormData.ICommand;

  if (turn !== 0 && turn !== 1) {
    throw throwError(400, "Turn chỉ được phép là 0 hoặc 1");
  }

  const result = await DeviceService.control(id, {
    turn
  });

  await DeviceService.update(id, { turn });

  return ApiResponse.success(res, 200, "Cập nhật trạng thái điều khiển thành công", result);
};
