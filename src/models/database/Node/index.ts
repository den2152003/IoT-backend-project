import mongoose from "mongoose";
import NodeSchema, { type INode } from "./NodeSchema";

const Node = mongoose.model<INode>("Node", NodeSchema);

export default Node;
