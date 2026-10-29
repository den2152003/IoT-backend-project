import type { Request, Response } from "express";

import { EmployeeService } from "@/services";
import { EmployeeFormData } from "@/shared-types/Form-data";
import { ApiResponse } from "@/utils/ApiResponse";

import * as XLSX from "xlsx";
import { EUserLevel } from "@/shared-types/Common/role";

export const create = async (req: Request, res: Response) => {
  const userId = req.token.userId;
  const formData: EmployeeFormData.ICreate = req.body;

  const employee = await EmployeeService.create(formData, userId);

  return ApiResponse.success(res, 201, "Tạo nhân viên thành công", employee);
};

export const getList = async (req: Request, res: Response) => {
  const userId = req.token.userId;
  const level = req.token.level;

  const formData: EmployeeFormData.IGetList = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search ? String(req.query.search) : undefined
  };

  let result = null;

  if (level === "ADMIN") {
    result = await EmployeeService.getListForAdmin(formData);
  } else {
    result = await EmployeeService.getList(formData, userId);
  }

  return ApiResponse.success(res, 200, "Lấy danh sách nhân viên thành công", result);
};

export const getDetail = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const employee = await EmployeeService.getDetail(id);

  return ApiResponse.success(res, 200, "Lấy chi tiết nhân viên thành công", employee);
};

export const update = async (req: Request, res: Response) => {
  const formData: EmployeeFormData.IUpdate = req.body;

  const employee = await EmployeeService.update(req.params.id as string, formData);

  return ApiResponse.success(res, 200, "Cập nhật nhân viên thành công", employee);
};

export const updateStatus = async (req: Request, res: Response) => {
  const result = await EmployeeService.updateStatus(req.params.id as string, req.body);

  return ApiResponse.success(res, 200, "Cập nhật trạng thái nhân viên thành công", result);
};

export const remove = async (req: Request, res: Response) => {
  await EmployeeService.remove(req.params.id as string);

  return ApiResponse.success(res, 200, "Xóa nhân viên thành công");
};

export const selection = async (req: Request, res: Response) => {
  const result = await EmployeeService.selection();

  return ApiResponse.success(res, 200, "Lấy danh sách nhân viên", result);
};

export const importMany = async (req: Request, res: Response) => {
  const userId = req.token.userId;
  const file = req.file;

  console.log("req.file:", req.file);
  console.log("req.body:", req.body);

  if (!file) {
    return res.status(400).json({
      code: 400,
      status: false,
      message: "Vui lòng tải lên file Excel.",
      data: null
    });
  }

  try {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "File Excel không có sheet dữ liệu.",
        data: null
      });
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });

    if (rows.length === 0) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "File Excel không có dữ liệu.",
        data: null
      });
    }

    if (rows.length > 500) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "File Excel chỉ được import tối đa 500 dòng.",
        data: null
      });
    }

    const validEmployees: Array<{
      username: string;
      password: string;
      fullname: string;
      level: EmployeeFormData.ICreate["level"];
      permissions: EmployeeFormData.ICreate["permissions"];
      rowNumber: number;
    }> = [];

    const invalidResults: Array<{
      rowNumber: number;
      username: string;
      success: boolean;
      message: string;
    }> = [];

    const parseBoolean = (value: unknown): boolean | null => {
      if (value === "" || value === null || value === undefined) {
        return false;
      }

      if (typeof value === "boolean") return value;
      if (typeof value === "number") {
        if (value === 1) return true;
        if (value === 0) return false;
        return null;
      }

      const normalized = String(value).trim().toLowerCase();

      if (["true", "1", "yes", "có"].includes(normalized)) {
        return true;
      }

      if (["false", "0", "no", "không"].includes(normalized)) {
        return false;
      }

      return null;
    };

    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      const username = String(row.username ?? "").trim();
      const password = String(row.password ?? "");
      const fullname = String(row.fullname ?? "").trim();
      const level = String(row.level ?? "")
        .trim()
        .toUpperCase();

      const canManageProjects = parseBoolean(row.canManageProjects);
      const canManageEmployees = parseBoolean(row.canManageEmployees);

      let message = "";

      if (!username) {
        message = "Username không được để trống.";
      } else if (!password.trim()) {
        message = "Password không được để trống.";
      } else if (!fullname) {
        message = "Fullname không được để trống.";
      } else if (level !== EUserLevel.MANAGER && level !== EUserLevel.STAFF) {
        message = "Level phải là MANAGER hoặc STAFF.";
      } else if (canManageProjects === null || canManageEmployees === null) {
        message = "Quyền phải là true/false, 1/0, Có/Không hoặc để trống.";
      }

      if (message) {
        invalidResults.push({
          rowNumber,
          username,
          success: false,
          message
        });
        return;
      }

      validEmployees.push({
        username,
        password,
        fullname,
        level: level as EmployeeFormData.ICreate["level"],
        permissions: {
          canManageProjects: canManageProjects!,
          canManageEmployees: canManageEmployees!
        },
        rowNumber
      });
    });

    const importResult =
      validEmployees.length > 0
        ? await EmployeeService.importMany(validEmployees, userId)
        : {
            total: 0,
            successCount: 0,
            failedCount: 0,
            results: []
          };

    const results = [...invalidResults, ...importResult.results].sort(
      (a, b) => a.rowNumber - b.rowNumber
    );

    const successCount = results.filter((item) => item.success).length;

    const failedCount = results.length - successCount;

    return ApiResponse.success(res, 200, "Hoàn tất import nhân viên", {
      total: results.length,
      successCount,
      failedCount,
      results
    });
  } catch (error) {
    console.error("Import employees failed:", error);

    return res.status(400).json({
      code: 400,
      status: false,
      message: "Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.",
      data: null
    });
  }
};
