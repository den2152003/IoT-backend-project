export enum ESensorDataType {
  day = "day",
  week = "week",
  month = "month"
}

export interface ISensorDataPayload {
  temperature: number;
  air: number;
  humidity: number;
  light: number;
}

export interface IGetList {
  page?: number;
  limit?: number;
  nodeId?: string;
}

export interface IGetStatistics {
  nodeId: string;
  type: ESensorDataType;
}
