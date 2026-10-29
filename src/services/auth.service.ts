import ENV from "@/cores/ENV";
import Account from "@/models/database/Account";
import RefreshToken from "@/models/database/RefreshToken";
import { EUserLevel } from "@/shared-types/Common/role";
import { throwError } from "@/utils/ApiResponse";
import { comparePassword } from "@/utils/hashPassword";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  type ITokenPayload
} from "@/utils/webToken";

interface ISignInInput {
  username: string;
  password: string;
}

interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: ITokenPayload;
}

export const signIn = async (input: ISignInInput): Promise<IAuthResponse> => {
  const { username, password } = input;

  if (username === ENV.ADMIN_USER_NAME && password === ENV.ADMIN_PASSWORD) {
    const payload: ITokenPayload = {
      userId: ENV.ADMIN_ID,
      username: ENV.ADMIN_USER_NAME,
      fullname: ENV.ADMIN_NAME,
      level: EUserLevel.ADMIN,
      permissions: {
        canManageProjects: true,
        canManageEmployees: true
      }
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await RefreshToken.create({
      userId: payload.userId,
      token: refreshToken,
      level: payload.level,
      expiresAt: getRefreshTokenExpiresAt()
    });

    return {
      accessToken,
      refreshToken,
      user: payload
    };
  }

  // Employee lấy từ MongoDB
  const account = await Account.findOne({
    username,
    status: true
  });

  if (!account) {
    return throwError(401, "Tên đăng nhập không tồn tại");
  }

  const isPasswordValid = await comparePassword(password, account.password);

  if (!isPasswordValid) {
    return throwError(401, "Password không đúng");
  }

  const payload: ITokenPayload = {
    userId: account._id.toString(),
    username: account.username,
    fullname: account.fullname,
    level: account.level,
    permissions: account.permissions
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await RefreshToken.create({
    userId: payload.userId,
    token: refreshToken,
    level: payload.level,
    expiresAt: getRefreshTokenExpiresAt()
  });

  return {
    accessToken,
    refreshToken,
    user: payload
  };
};

export const refreshToken = async (
  currentRefreshToken: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: ITokenPayload;
}> => {
  const payload = verifyRefreshToken(currentRefreshToken);

  const storedToken = await RefreshToken.findOne({
    userId: payload.userId,
    token: currentRefreshToken
  });

  if (!storedToken) {
    return throwError(401, "Refresh token không hợp lệ");
  }

  if (storedToken.expiresAt.getTime() <= Date.now()) {
    await RefreshToken.deleteOne({
      _id: storedToken._id
    });

    // throw new AppError(401, "Refresh token đã hết hạn");
    return throwError(401, "Refresh token đã hết hạn");
  }

  const newPayload: ITokenPayload = {
    userId: payload.userId,
    username: payload.username,
    fullname: payload.fullname,
    level: payload.level,
    permissions: payload.permissions
  };

  const newAccessToken = generateAccessToken(newPayload);

  const newRefreshToken = generateRefreshToken(newPayload);

  // Refresh token rotation
  await RefreshToken.deleteOne({
    _id: storedToken._id
  });

  await RefreshToken.create({
    userId: newPayload.userId,
    token: newRefreshToken,
    level: newPayload.level,
    expiresAt: getRefreshTokenExpiresAt()
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: newPayload
  };
};

export const signOut = async (currentRefreshToken: string): Promise<void> => {
  await RefreshToken.deleteOne({
    token: currentRefreshToken
  });
};

const getRefreshTokenExpiresAt = (): Date => {
  const expiresIn = ENV.REFRESH_TOKEN_EXPIRES_IN;

  const match = expiresIn.match(/^(\d+)([smhd])$/);

  if (!match) {
    return throwError(500, "REFRESH_TOKEN_EXPIRES_IN không hợp lệ");
  }

  const value = Number(match[1]);
  const unit = match[2] as "s" | "m" | "h" | "d";

  const millisecondsMap: Record<"s" | "m" | "h" | "d", number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return new Date(Date.now() + value * millisecondsMap[unit]);
};
