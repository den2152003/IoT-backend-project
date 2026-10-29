export interface IRegisterDevice {
  wifiName: string;
  macId: string;
}

export interface ICreateNode {
  name: string;
  description: string;
  macId: string;
  wifiName: string;
  gatewayId: string;
}

export interface IGetList {
  page?: number;
  limit?: number;
  search?: string;
  gatewayId?: string;
}

export interface IUpdateNode {
  name?: string;
  description?: string;
  macId?: string;
  wifiName?: string;
  gatewayId?: string;
}
