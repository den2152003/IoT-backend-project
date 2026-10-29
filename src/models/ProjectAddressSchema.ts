import { Schema } from "mongoose";

export interface IProjectAddress {
  latitude?: number;
  longitude?: number;
  detail?: string;
}

export const ProjectAddressSchema = new Schema<IProjectAddress>(
  {
    latitude: {
      type: Number,
      default: 0
    },

    longitude: {
      type: Number,
      default: 0
    },

    detail: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    _id: false
  }
);
