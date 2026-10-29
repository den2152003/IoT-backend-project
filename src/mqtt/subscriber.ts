import { mqttClient } from "@/mqtt/client";
import { MQTT_TOPICS } from "@/mqtt/topics";
import { handleMqttMessage } from "@/mqtt/handler";

const MQTT_SUBSCRIBE_TOPICS = [
  MQTT_TOPICS.GATEWAY_REGISTER,
  MQTT_TOPICS.NODE_REGISTER,
  MQTT_TOPICS.SENSOR_DATA
];

export const subscribeMqttTopics = (): void => {
  mqttClient.subscribe(MQTT_SUBSCRIBE_TOPICS, (error) => {
    if (error) {
      console.error("MQTT subscribe error:", error);
      return;
    }

    console.log("MQTT subscribed:", MQTT_SUBSCRIBE_TOPICS);
  });

  mqttClient.on("message", (topic, payload) => {
    void handleMqttMessage(topic, payload);
  });
};
