import type { Buffer } from "node:buffer";

import { NodeService, ProjectService, SensorDataService } from "@/services";

import { MQTT_TOPICS } from "./topics";
import { publishGatewayConfig, publishNodeConfig } from "./publisher";
import { SensorDataFormData } from "@/shared-types/Form-data";

interface IRegisterPayload {
  wifiName: string;
  macId: string;
}

const parseRegisterPayload = (payload: Buffer): IRegisterPayload | null => {
  try {
    const parsed: unknown = JSON.parse(payload.toString());

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("wifiName" in parsed) ||
      !("macId" in parsed) ||
      typeof parsed.wifiName !== "string" ||
      typeof parsed.macId !== "string"
    ) {
      return null;
    }

    return {
      wifiName: parsed.wifiName,
      macId: parsed.macId
    };
  } catch {
    return null;
  }
};

const parseSensorDataPayload = (payload: Buffer): SensorDataFormData.ISensorDataPayload | null => {
  try {
    const parsed: unknown = JSON.parse(payload.toString());

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("temperature" in parsed) ||
      !("air" in parsed) ||
      !("humidity" in parsed) ||
      !("light" in parsed) ||
      typeof parsed.temperature !== "number" ||
      typeof parsed.air !== "number" ||
      typeof parsed.humidity !== "number" ||
      typeof parsed.light !== "number"
    ) {
      return null;
    }

    return {
      temperature: parsed.temperature,
      air: parsed.air,
      humidity: parsed.humidity,
      light: parsed.light
    };
  } catch {
    return null;
  }
};

export const handleMqttMessage = async (topic: string, payload: Buffer): Promise<void> => {
  try {
    if (topic === MQTT_TOPICS.NODE_REGISTER || topic === MQTT_TOPICS.GATEWAY_REGISTER) {
      const registerPayload = parseRegisterPayload(payload);

      if (!registerPayload) {
        console.error("Invalid MQTT register payload:", topic);
        return;
      }

      if (topic === MQTT_TOPICS.GATEWAY_REGISTER) {
        const project = await ProjectService.registerDevice(registerPayload);

        publishGatewayConfig(registerPayload.macId, project.number);

        return;
      }

      if (topic === MQTT_TOPICS.NODE_REGISTER) {
        await NodeService.registerDevice(registerPayload);
      }
    }

    if (topic.startsWith(MQTT_TOPICS.SENSOR_DATA_PREFIX)) {
      const macId = topic.slice(MQTT_TOPICS.SENSOR_DATA_PREFIX.length);

      if (!macId) {
        console.error("Invalid sensor data topic:", topic);
        return;
      }

      const sensorPayload = parseSensorDataPayload(payload);

      if (!sensorPayload) {
        console.error("Invalid sensor data payload:", topic);
        return;
      }

      await SensorDataService.createByNodeMacId(macId, sensorPayload);

      return;
    }
  } catch (error) {
    console.error("MQTT message error:", error);
  }
};
