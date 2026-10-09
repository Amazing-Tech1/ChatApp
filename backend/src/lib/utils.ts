import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import type { Response } from "express";
import type { Types } from "mongoose";
import User from "../models/User.js";

export async function generateTokens(userId: Types.ObjectId, res: Response) {
  const { JWT_SECRET, JWT_REFRESH_SECRET, NODE_ENV } = process.env;

  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not configured");
  }

  const jti = randomUUID();

  const refreshToken = jwt.sign(
    {
      userId: userId.toString(),
      type: "refresh",
      jti,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  const accessToken = jwt.sign(
    {
      userId: userId.toString(),
      type: "access",
    },
    JWT_SECRET,
    { expiresIn: "15m" },
  );

  await User.findByIdAndUpdate(userId, {
    refreshTokenId: jti,
  });

  const cookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
