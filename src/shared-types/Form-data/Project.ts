import { EUserLevel } from "../Common/role";

export interface IRegisterDevice {
  wifiName: string;
  macId: string;
}

export interface ICreateProject {
  name: string;
  employeeIds: string[];
  description: string;
  wifiName: string;
  macId: string;
  address: {
    latitude: number;
    longitude: number;
    detail: string;
  };
}

export interface IGetList {
  level: EUserLevel;
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface IUpdateProject {
  name?: string;
  employeeIds?: string[];
  description?: string;
  wifiName?: string;
  macId?: string;
  address?: {
    latitude?: number;
    longitude?: number;
    detail?: string;
  };
}
