import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

export interface ISensorData {
  nodeId: mongoose.Types.ObjectId;
  temperature: number;
  air: number;
  humidity: number;
  light: number;
}

export type SensorDataDocument = HydratedDocument<ISensorData>;

export type SensorDataModel = Model<ISensorData>;

const SensorDataSchema = new Schema<ISensorData>(
  {
    nodeId: {
      type: Schema.Types.ObjectId,
      ref: "Node",
      required: true
    },

    temperature: {
      type: Number,
      required: true
    },

    air: {
      type: Number,
      required: true
    },

    humidity: {
      type: Number,
      required: true
    },

    light: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default SensorDataSchema;
