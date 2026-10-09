import type { Request, Response } from "express";
import connectDB from "../lib/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateTokens } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailhandler.js";
import "dotenv/config";

interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function signUp(req: Request<{}, {}, SignUpBody>, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ status: false, message: "All fields required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ status: false, message: "password must be at least 6 characters" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: false,
      message: "Please provide a valid email address",
    });
  }
  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: false,
        message: "Email already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      await newUser.save();
      await generateTokens(newUser._id, res);

      res.status(201).json({
        status: true,
        message: "Account created successfully",
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          image_url: newUser.image_url,
        },
      });

      //send user a welcome email
      try {
        await sendWelcomeEmail(newUser.name, newUser.email, process.env.CLIENT_URL as string);
      } catch (error) {
        console.error("Error sending welcome email:", error);
      }
    } else {
      res.status(400).json({
        status: false,
        message: "Invalid user Data!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: error,
    });
  }
}

export async function logIn(req: Request<{}, {}, LoginBody>, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: false, message: "All fields required" });
  }
  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid email or password",
      });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          status: false,
          message: "Invalid email or password",
        });
      }
    }
    await generateTokens(user._id, res);
    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image_url: user.image_url,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}

export async function logOut(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies?.refreshToken;

    if (token && process.env.JWT_REFRESH_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as {
          userId: string;
          type: string;
          jti: string;
        };

        if (decoded.type === "refresh" && decoded.jti) {
          await User.findOneAndUpdate(
            {
              _id: decoded.userId,
              refreshTokenId: decoded.jti,
            },
            {
              $set: { refreshTokenId: null },
            },
          );
        }
      } catch (error) {
        console.error("Error verifying refresh token during logout:", error);
      }
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: unknown) {
    console.error("Logout error:", error);

    res.status(500).json({
      success: false,
      message: "An unexpected error occurred during logout.",
    });
  }
}

export function updateProfile(req: Request, res: Response): void {}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refreshToken;
  const { JWT_SECRET, JWT_REFRESH_SECRET, NODE_ENV } = process.env;

  if (!token) {
    res.status(401).json({
      status: false,
      message: "Refresh token missing. Please log in again.",
    });
    return;
  }

  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as {
      userId: string;
      type: string;
      jti: string;
    };
    if (!decoded || !decoded.userId) {
      res.status(401).json({
        status: false,
        message: "Invalid refresh token. Please log in again.",
      });
      return;
    }

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshTokenId !== decoded.jti) {
      res.status(401).json({
        status: false,
        message: "Refresh token is invalid or revoked. Please log in again.",
      });
      return;
    }
    // Generate a new access token.
    const accessToken = jwt.sign({ userId: user._id.toString(), type: "access" }, JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      status: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}
