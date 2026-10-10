import mongoose, { type Model } from "mongoose";
import type { IUser } from "../types/express.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    image_url: {
      type: String,
      default: "",
    },
    refreshTokenId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema);

export default User;
