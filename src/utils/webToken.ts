import jwt, { type SignOptions } from "jsonwebtoken";

import ENV from "@/cores/ENV";
import { EUserLevel } from "@/shared-types/Common/role";
import { IAccountPermissions } from "@/models/AccountPermissionsSchema";

export interface ITokenPayload {
  userId: string;
  username: string;
  fullname: string;
  level: EUserLevel;
  permissions: IAccountPermissions;
}

export const generateAccessToken = (
  payload: ITokenPayload,
): string => {
  const options: SignOptions = {
    expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    payload,
    ENV.ACCESS_TOKEN_SECRET,
    options,
  );
};

export const generateRefreshToken = (
  payload: ITokenPayload,
): string => {
  const options: SignOptions = {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    payload,
    ENV.REFRESH_TOKEN_SECRET,
    options,
  );
};

export const verifyAccessToken = (
  token: string,
): ITokenPayload => {
  return jwt.verify(
    token,
    ENV.ACCESS_TOKEN_SECRET,
  ) as ITokenPayload;
};

export const verifyRefreshToken = (
  token: string,
): ITokenPayload => {
  return jwt.verify(
    token,
    ENV.REFRESH_TOKEN_SECRET,
  ) as ITokenPayload;
};