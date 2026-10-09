import type { Request, Response } from "express";
import connectDB from "../lib/db.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailhandler.js";
import "dotenv/config";

interface SignUpBody {
  name: string;
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
      generateToken(newUser._id, res);

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
