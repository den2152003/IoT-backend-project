import {
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

import { EUserLevel } from "@/shared-types/Common/role";

export interface IRefreshToken {
  userId: string;
  token: string;
  level: EUserLevel;
  expiresAt: Date;
}

export type RefreshTokenDocument =
  HydratedDocument<IRefreshToken>;

export type RefreshTokenModel =
  Model<IRefreshToken>;

const RefreshTokenSchema =
  new Schema<IRefreshToken>({
    userId: {
      type: String,
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: Object.values(EUserLevel),
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  });

export default RefreshTokenSchema;