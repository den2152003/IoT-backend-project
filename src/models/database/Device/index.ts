import mongoose from "mongoose";
import DeviceSchema, { type IDevice } from "./DeviceSchema";

const Device = mongoose.model<IDevice>("Device", DeviceSchema);

export default Device;
