export const MQTT_TOPICS = {
  GATEWAY_REGISTER: "gateway/register",
  NODE_REGISTER: "node/register",

  SENSOR_DATA: "sensorData/+",

  SENSOR_DATA_PREFIX: "sensorData/",

  gatewayConfig: (macId: string) => `gateway/${macId}/config`,

  nodeConfig: (macId: string) => `node/${macId}/config`,

  realtimeSensorData: (macId: string) => `sensorData/realtime/${macId}`,

  gatewayCommand: (gatewayId: string) => `controlDevice/${gatewayId}/command`
} as const;
