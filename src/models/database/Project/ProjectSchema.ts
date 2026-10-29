import { IProjectAddress, ProjectAddressSchema } from "@/models/ProjectAddressSchema";
import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

export interface IProject {
  name?: string;
  employeeIds: mongoose.Types.ObjectId[];
  description?: string;
  number: number;
  wifiName: string;
  macId: string;
  address?: IProjectAddress;
  isDelete: boolean;
  createdBy?: mongoose.Types.ObjectId;
}

export type ProjectDocument = HydratedDocument<IProject>;

export type ProjectModel = Model<IProject>;

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      trim: true
    },

    employeeIds: {
      type: [Schema.Types.ObjectId],
      ref: "Account",
      default: []
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

    wifiName: {
      type: String,
      required: true,
      trim: true
    },

    macId: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: ProjectAddressSchema
    },

    isDelete: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Account"
    }
  },
  {
    timestamps: true
  }
);

export default ProjectSchema;
