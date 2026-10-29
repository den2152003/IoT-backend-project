import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";
import { EUserLevel } from "@/shared-types/Common/role";
import { AccountPermissionsSchema, IAccountPermissions } from "@/models/AccountPermissionsSchema";

export interface IAccount {
  username: string;
  password: string;
  fullname: string;
  level: EUserLevel.MANAGER | EUserLevel.STAFF;
  status: boolean;
  permissions: IAccountPermissions;
  isDelete: boolean;
  createdBy?: mongoose.Types.ObjectId;
}

export type AccountDocument = HydratedDocument<IAccount>;

export type AccountModel = Model<IAccount>;

const AccountSchema = new Schema<IAccount>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    fullname: {
      type: String,
      required: true,
      trim: true
    },

    level: {
      type: String,
      enum: [EUserLevel.MANAGER, EUserLevel.STAFF],
      required: true
    },

    status: {
      type: Boolean,
      default: true
    },

    permissions: {
      type: AccountPermissionsSchema,
      default: {}
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

export default AccountSchema;
