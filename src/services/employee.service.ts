import Account from "@/models/database/Account";
import { EUserLevel } from "@/shared-types/Common/role";
import { EmployeeFormData } from "@/shared-types/Form-data";
import { throwError } from "@/utils/ApiResponse";
import { hashPassword } from "@/utils/hashPassword";

export const create = async (formData: EmployeeFormData.ICreate, userId: string) => {
  const existedAccount = await Account.findOne({
    username: formData.username
  });

  if (existedAccount) {
    return throwError(409, "Tên đăng nhập đã tồn tại");
  }

  const password = await hashPassword(formData.password);

  return await Account.create({
    username: formData.username,
    password,
    fullname: formData.fullname,
    level: formData.level,
    permissions: formData.permissions,
    status: true,
    createdBy: userId
  });
};

export const getList = async (formData: EmployeeFormData.IGetList, userId: string) => {
  const page = formData.page && formData.page > 0 ? formData.page : 1;
  const limit = formData.limit && formData.limit > 0 ? formData.limit : 20;

  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {
    isDelete: false,
    createdBy: userId
  };

  if (formData.search) {
    query.$or = [
      { fullname: { $regex: formData.search, $options: "i" } },
      { username: { $regex: formData.search, $options: "i" } }
    ];
  }

  const [rows, count] = await Promise.all([
    Account.find(query).select("-password").sort({ _id: -1 }).skip(skip).limit(limit).lean(),
    Account.countDocuments(query)
  ]);

  return {
    rows,
    count,
    page,
    limit
  };
};

export const getListForAdmin = async (formData: EmployeeFormData.IGetList) => {
  const page = formData.page && formData.page > 0 ? formData.page : 1;
  const limit = formData.limit && formData.limit > 0 ? formData.limit : 20;

  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {
    isDelete: false
  };

  if (formData.search) {
    query.$or = [
      { fullname: { $regex: formData.search, $options: "i" } },
      { username: { $regex: formData.search, $options: "i" } }
    ];
  }

  const [rows, count] = await Promise.all([
    Account.find(query).select("-password").sort({ _id: -1 }).skip(skip).limit(limit).lean(),
    Account.countDocuments(query)
  ]);

  return {
    rows,
    count,
    page,
    limit
  };
};

export const getDetail = async (id: string) => {
  const employee = await Account.findById(id).select("-password").lean();

  if (!employee) {
    throw throwError(404, "Không tìm thấy nhân viên");
  }

  return employee;
};

export const update = async (id: string, formData: EmployeeFormData.IUpdate) => {
  const employee = await Account.findById(id);

  if (!employee) {
    throw throwError(404, "Không tìm thấy nhân viên");
  }

  if (formData.fullname !== undefined) {
    employee.fullname = formData.fullname;
  }

  if (formData.level !== undefined) {
    employee.level = formData.level;
  }

  if (formData.password !== undefined) {
    employee.password = await hashPassword(formData.password);
  }

  if (formData.permissions !== undefined) {
    employee.permissions = formData.permissions;
  }

  await employee.save();

  return {
    id: employee._id,
    username: employee.username,
    fullname: employee.fullname,
    level: employee.level,
    status: employee.status,
    permissions: employee.permissions
  };
};

export const updateStatus = async (id: string, formData: EmployeeFormData.IUpdateStatus) => {
  const employee = await Account.findById(id);

  if (!employee) {
    throw throwError(404, "Không tìm thấy nhân viên");
  }

  employee.status = formData.status;

  await employee.save();

  return {
    id: employee._id,
    username: employee.username,
    fullname: employee.fullname,
    level: employee.level,
    status: employee.status
  };
};

export const remove = async (id: string) => {
  await Account.findByIdAndUpdate(id, { isDelete: true });
};

export const selection = async () => {
  return await Account.find({ isDelete: false, status: true, level: EUserLevel.STAFF })
    .select("_id fullname")
    .lean();
};


interface EmployeeImportItem {
  username: string;
  password: string;
  fullname: string;
  level: EmployeeFormData.ICreate["level"];
  permissions?: {
    canManageProjects: boolean;
    canManageEmployees: boolean;
  };
  rowNumber: number;
}

interface EmployeeImportResult {
  rowNumber: number;
  username: string;
  success: boolean;
  message: string;
}

export const importMany = async (
  employees: EmployeeImportItem[],
  userId: string,
) => {
  const results: EmployeeImportResult[] = [];

  for (const employee of employees) {
    const {
      username,
      password,
      fullname,
      level,
      permissions,
      rowNumber,
    } = employee;

    try {
      // Kiểm tra tài khoản đã tồn tại.
      const existedAccount = await Account.findOne({ username });

      if (existedAccount) {
        results.push({
          rowNumber,
          username,
          success: false,
          message: "Tên đăng nhập đã tồn tại.",
        });
        continue;
      }

      if(level !== EUserLevel.STAFF && level !== EUserLevel.MANAGER) {
        results.push({
          rowNumber,
          username,
          success: false,
          message: "Level không hợp lệ.",
        })
      }

      // Hash password trước khi lưu DB.
      const hashedPassword = await hashPassword(password);

      await Account.create({
        username,
        password: hashedPassword,
        fullname,
        level,
        permissions: permissions ?? {
          canManageProjects: false,
          canManageEmployees: false,
        },
        status: true,
        createdBy: userId,
      });

      results.push({
        rowNumber,
        username,
        success: true,
        message: "Tạo nhân viên thành công.",
      });
    } catch (error) {
      results.push({
        rowNumber,
        username,
        success: false,
        message: "Không thể tạo nhân viên.",
      });
    }
  }

  const successCount = results.filter((item) => item.success).length;

  return {
    total: results.length,
    successCount,
    failedCount: results.length - successCount,
    results,
  };
};
