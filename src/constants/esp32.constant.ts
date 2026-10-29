export const ESP32_OUTPUT_PINS = [4, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33] as const;

export type Esp32OutputPin = (typeof ESP32_OUTPUT_PINS)[number];
