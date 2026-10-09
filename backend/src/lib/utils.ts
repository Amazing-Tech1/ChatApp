import jwt from "jsonwebtoken";
import "dotenv/config";
import { Types } from "mongoose";
import type { Response } from "express";

export function generateToken(userId: Types.ObjectId, res: Response) {
  const token = jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
}
