import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

export interface INode {
  name?: string;
  description?: string;
  number: number;
  macId: string;
  wifiName: string;
  gatewayId?: mongoose.Types.ObjectId;
  isDelete: boolean;
}

export type NodeDocument = HydratedDocument<INode>;

export type NodeModel = Model<INode>;

const NodeSchema = new Schema<INode>(
  {
    name: {
      type: String,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    number: {
      type: Number,
      required: true,
      unique: true
    },

    macId: {
      type: String,
      required: true,
      trim: true
    },

    wifiName: {
      type: String,
      required: true,
      trim: true
    },

    gatewayId: {
      type: Schema.Types.ObjectId,
      ref: "Project"
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

export default NodeSchema;
