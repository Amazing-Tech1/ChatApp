import type { Request, Response } from "express";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { uploadImage } from "../utils/imageUpload.js";

export async function getAllContacts(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      status: true,
      message: "Unauthorized user",
    });
    return;
  }
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select([
      "-password",
      "-refreshTokenId",
    ]);
    res.status(200).json({
      status: true,
      users: filteredUsers,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}
export async function getAllChats(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        status: false,
        message: "Unauthorized user",
      });
      return;
    }
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    const chatPartnersId = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === userId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    const chats = await User.find({ _id: { $in: chatPartnersId } }).select([
      "-password",
      "-refreshTokenId",
    ]);

    res.status(200).json({
      status: true,
      chats,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}

export async function getChatWithUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({
        status: false,
        message: "Unauthorized user",
      });
      return;
    }
    const { id } = req.params;
    const otherUser = await Message.find({
      $or: [
        { senderId: userId, receiverId: id },
        { senderId: id, receiverId: userId },
      ],
    });
    res.status(200).json({
      status: true,
      user: otherUser,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}

export async function sendMessage(req: Request, res: Response): Promise<void> {
  const { text, image } = req.body;
  const { id } = req.params;
  try {
    if (!req.user) {
      res.status(401).json({
        status: false,
        message: "Unauthorized user",
      });
      return;
    }
    const senderId = req.user._id;

    if (!text && !image) {
      res.status(400).json({ success: false, message: "Text or Image is required" });
      return;
    }
    if (senderId.equals(id)) {
      res.status(400).json({ success: false, message: "You cannot send message to yourself" });
      return;
    }

    const receiverExists = await User.exists({ _id: id });
    if (!receiverExists) {
      res.status(404).json({ success: false, message: "Receiver not found!" });
      return;
    }

    let imageUrl: string | undefined = undefined;

    if (image) {
      const uploadedImage = await uploadImage(image, "message");
      imageUrl = uploadedImage.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId: id,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    //todo: send message in real time if user is online --socket.io

    res.status(201).json({
      status: true,
      data: newMessage,
    });
  } catch (error: any) {
    console.error("Error while sending message:", error);

    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}
