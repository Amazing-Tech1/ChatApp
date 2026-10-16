import { Server } from "socket.io";
import http, { type Server as HttpServer } from "http";
import express, { type Express } from "express";
import "dotenv/config";
import { corsOptions } from "../utils/corsOption.js";
import { socketAuthMiddleware } from "../middleware/socket_auth.js";

const app: Express = express();

const server: HttpServer = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

io.use(socketAuthMiddleware);

// Map each user ID to their connected socket ID(s)
const userSocketMap: Record<string, string> = {};

io.on("connection", (socket) => {
  const userId = socket.data.userId;

  console.log("A user connected:", userId);

  userSocketMap[userId] = socket.id;

  // console.log("Current online user IDs:", Object.keys(userSocketMap));

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", userId);

    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];

      // console.log("Current online user IDs:", Object.keys(userSocketMap));

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});
export { app, server, io };
