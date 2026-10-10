import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

export async function protectedRoute(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized: No accesstoken provided",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: Invalid access token",
      });
    }

    const user = await User.findById(decoded.userId).select(["-password", "-refreshTokenId"]); // Exclude the password and refreshTokenId fields from the user object
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: User not found",
      });
    }
    req.user = user; // Attach the user object to the request for further use in the route handler
    next();
  } catch (error) {
    console.log("Protected MiddleWare Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error: Unable to verify access token",
    });
  }
}
