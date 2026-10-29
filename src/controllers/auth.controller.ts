import type { Request, Response } from "express";

import { AuthService } from "@/services";

import { REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions } from "@/cores/cookie";

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await AuthService.signIn(req.body);

    res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        accessToken: result.accessToken,
        user: result.user
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Đăng nhập thất bại",
      data: null
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshTokenValue = req.cookies[REFRESH_TOKEN_COOKIE];

    if (!refreshTokenValue) {
      res.status(401).json({
        success: false,
        message: "Refresh token không tồn tại",
        data: null
      });

      return;
    }

    const result = await AuthService.refreshToken(refreshTokenValue);

    res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: "Refresh token thành công",
      data: {
        accessToken: result.accessToken,
        user: result.user
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Refresh token thất bại",
      data: null
    });
  }
};

export const signOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshTokenValue = req.cookies[REFRESH_TOKEN_COOKIE];

    if (refreshTokenValue) {
      await AuthService.signOut(refreshTokenValue);
    }

    res.clearCookie(REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Đăng xuất thất bại",
      data: null
    });
  }
};
