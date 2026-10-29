import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

export interface IDevice {
  name?: string;
  description?: string;
  nodeId: mongoose.Types.ObjectId;
  pin: number;
  turn: number;
  isDelete: boolean;
}

export type DeviceDocument = HydratedDocument<IDevice>;
export type DeviceModel = Model<IDevice>;

const DeviceSchema = new Schema<IDevice>(
  {
    name: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    nodeId: {
      type: Schema.Types.ObjectId,
      ref: "Node",
      required: true
    },
    pin: {
      type: Number,
      required: true
    },
    turn:{
      type: Number,
      required: true,
      default: 0
    },
    isDelete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default DeviceSchema;
