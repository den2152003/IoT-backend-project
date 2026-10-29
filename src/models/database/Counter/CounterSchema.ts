import { Schema, type HydratedDocument, type Model } from "mongoose";

export interface ICounter {
  name: string;
  seq: number;
}

export type CounterDocument = HydratedDocument<ICounter>;

export type CounterModel = Model<ICounter>;

const CounterSchema = new Schema<ICounter>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    seq: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default CounterSchema;
