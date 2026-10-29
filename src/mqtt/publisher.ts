import { mqttClient } from "./client";
import { MQTT_TOPICS } from "./topics";

export const publishGatewayConfig = (macId: string, number: number): void => {
  mqttClient.publish(
    MQTT_TOPICS.gatewayConfig(macId),
    JSON.stringify({
      number
    })
  );
};

export const publishNodeConfig = (
  macId: string,
  nodeNumber: number,
  gatewayNumber: number | null
): void => {
  mqttClient.publish(
    MQTT_TOPICS.nodeConfig(macId),
    JSON.stringify({
      nodeNumber,
      gatewayNumber
    })
  );
};

export const publishRealtimeSensorData = (
  macId: string,
  data: {
    temperature: number;
    air: number;
    humidity: number;
    light: number;
  }
): void => {
  mqttClient.publish(MQTT_TOPICS.realtimeSensorData(macId), JSON.stringify(data));
};

export const publishDeviceCommand = (
  gatewayId: string,
  payload: {
    nodeNumber: number;
    pin: number;
    turn: 0 | 1;
  }
): void => {
  mqttClient.publish(MQTT_TOPICS.gatewayCommand(gatewayId), JSON.stringify(payload));
};
