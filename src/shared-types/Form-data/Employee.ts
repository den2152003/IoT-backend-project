import { IAccountPermissions } from "@/models/AccountPermissionsSchema";
import { EUserLevel } from "@/shared-types/Common/role";

export interface ICreate {
  username: string;
  password: string;
  fullname: string;
  level: EUserLevel.MANAGER | EUserLevel.STAFF;
  permissions: IAccountPermissions;
}

export interface IGetList {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IUpdate {
  fullname?: string;
  password?: string;
  level?: EUserLevel.MANAGER | EUserLevel.STAFF;
  permissions?: IAccountPermissions;
}

export interface IUpdateStatus {
  status: boolean;
}
