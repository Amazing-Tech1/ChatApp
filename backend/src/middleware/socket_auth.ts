import type { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

export async function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    const token = cookieHeader
      ?.split("; ")
      .find((cookie) => cookie.startsWith("accessToken="))
      ?.split("=")
      .slice(1)
      .join("=");

    if (!token) {
      return next(new Error("Unauthorized: No access token provided"));
    }

    const secret = process.env.JWT_SECRET as string;

    if (!secret) {
      return next(new Error("JWT_SECRET is not configured"));
    }

    const decoded = jwt.verify(token, secret) as { userId: string };

    if (!decoded?.userId) {
      return next(new Error("Unauthorized: Invalid access token"));
    }

    const user = await User.findById(decoded.userId).select(["-password", "-refreshTokenId"]);

    if (!user) {
      return next(new Error("Unauthorized: User not found"));
    }

    socket.data.user = user;
    socket.data.userId = user._id.toString();

    console.log(`Socket authenticated for this user: ${user.name} (${user._id})`);

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error("Access token expired"));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Error("Invalid access token"));
    }

    console.error("Socket authentication error:", error);
    next(new Error("Socket authentication failed"));
  }
}
