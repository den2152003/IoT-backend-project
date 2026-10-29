import mqtt from "mqtt";

import ENV from "@/cores/ENV";

export const mqttClient = mqtt.connect(ENV.MQTT_BROKER_URL, {
  username: ENV.MQTT_USERNAME,
  password: ENV.MQTT_PASSWORD
});

mqttClient.on("connect", () => {
  console.log("MQTT connected");
});

mqttClient.on("error", (error) => {
  console.error("MQTT error:", error);
});

mqttClient.on("reconnect", () => {
  console.log("MQTT reconnecting...");
});

mqttClient.on("close", () => {
  console.log("MQTT connection closed");
});
