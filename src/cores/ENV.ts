import "dotenv/config";

const ENV = {
  PORT: Number(process.env.PORT ?? 6001),

  MONGODB_URI: process.env.MONGODB_URI ?? "",

  // Admin tổng
  ADMIN_ID: process.env.ADMIN_ID ?? "",
  ADMIN_USER_NAME: process.env.ADMIN_USER_NAME ?? "",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "",
  ADMIN_PHONE_NUMBER: process.env.ADMIN_PHONE_NUMBER ?? "",
  ADMIN_NAME: process.env.ADMIN_NAME ?? "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "",

  // JWT
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? "",
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d",

  // Password
  PASSWORD_SECRET_KEY: process.env.PASSWORD_SECRET_KEY ?? "",
  DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD ?? "",

  MQTT_BROKER_URL: process.env.MQTT_BROKER_URL ?? "",
  MQTT_USERNAME: process.env.MQTT_USERNAME ?? "",
  MQTT_PASSWORD: process.env.MQTT_PASSWORD ?? ""
};

if (!ENV.MONGODB_URI) {
  throw new Error("MONGODB_URI is not configured");
}

export default ENV;
