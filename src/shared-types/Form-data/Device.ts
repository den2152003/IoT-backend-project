export interface ICreateDevice {
  name?: string;
  description?: string;
  nodeId: string;
  pin: number;
}

export interface IUpdateDevice {
  name?: string;
  description?: string;
  nodeId?: string;
  pin?: number;
  turn?: number;
}

export interface IGetList {
  page?: number;
  limit?: number;
  search?: string;
  nodeId?: string;
}

export interface ICommand {
  turn: 0 | 1;
}
