import mongoose from "mongoose";
import CounterSchema, { type ICounter } from "./CounterSchema";

const Counter = mongoose.model<ICounter>("Counter", CounterSchema);

export default Counter;
