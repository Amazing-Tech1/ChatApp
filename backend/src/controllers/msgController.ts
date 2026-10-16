import type { Request, Response } from "express";
import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

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
        messages
          .filter((msg) => msg.senderId.toString() !== msg.receiverId.toString())
          .map((msg) =>
            msg.senderId.toString() === userId.toString()
              ? msg.receiverId.toString()
              : msg.senderId.toString(),
          )
          .filter((id) => id !== userId.toString()),
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
  const { text } = req.body;
  const { id } = req.params;

  try {
    if (!req.user) {
      res.status(401).json({
        status: false,
        message: "Unauthorized user",
      });
      return;
    }

    // Validate receiver ID before using it.
    if (typeof id !== "string" || !id.trim()) {
      res.status(400).json({
        status: false,
        message: "Invalid receiver ID.",
      });
      return;
    }

    const senderId = req.user._id;
    const file = req.file;

    if (!text?.trim() && !file) {
      res.status(400).json({
        status: false,
        message: "Text or image is required.",
      });
      return;
    }

    if (senderId.equals(id)) {
      res.status(400).json({
        status: false,
        message: "You cannot send a message to yourself.",
      });
      return;
    }

    const receiverExists = await User.exists({ _id: id });

    if (!receiverExists) {
      res.status(404).json({
        status: false,
        message: "Receiver not found.",
      });
      return;
    }

    let imageUrl: string | undefined;

    if (file) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "chatapp/messages",
          resource_type: "image",
        },
      );

      imageUrl = result.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId: id,
      text: text?.trim() || "",
      image: imageUrl,
    });

    await newMessage.save();

    const recieverSocketId = getRecieverSocketId(id);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json({
      status: true,
      data: newMessage,
    });
  } catch (error: unknown) {
    console.error("Error while sending message:", error);

    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
}
