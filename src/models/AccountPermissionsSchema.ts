import { Schema } from "mongoose";

export interface IAccountPermissions {
  canManageProjects: boolean;
  canManageEmployees: boolean;
}

export const AccountPermissionsSchema = new Schema<IAccountPermissions>(
  {
    canManageProjects: {
      type: Boolean,
      default: false
    },
    canManageEmployees: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: false
  }
);
