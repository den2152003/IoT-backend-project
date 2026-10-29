import mongoose from "mongoose";

import SensorDataSchema, { type ISensorData } from "./SensorDataSchema";

const SensorData = mongoose.model<ISensorData>("SensorData", SensorDataSchema);

export default SensorData;
