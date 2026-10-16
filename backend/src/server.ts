import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import msgRoutes from "./routes/msg.js";
import path from "path";
import connectDB from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { aj } from "./lib/arcjet.js";
import { corsOptions } from "./utils/corsOption.js";
import { app, server } from "./lib/socket.js";

app.use(express.json({ limit: "6mb" }));
app.use(cors(corsOptions));
app.use(cookieParser());

const __dirname = path.resolve();
const PORT = Number(process.env.PORT) || 3000;

app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          status: false,
          message: "Too many requests. Please try again later.",
        });
        return;
      }

      if (decision.reason.isBot()) {
        res.status(403).json({
          status: false,
          message: "Bot access denied",
        });
        return;
      }

      res.status(403).json({
        status: false,
        message: "Forbidden",
      });
      return;
    }

    // Check for spoofed bots
    const spoofedBot = decision.results.some(
      (result) => result.reason.isBot() && result.reason.isSpoofed(),
    );

    if (spoofedBot) {
      res.status(403).json({
        status: false,
        message: "Spoofed bot detected",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Arcjet error:", error);

    if (process.env.NODE_ENV === "production") {
      res.status(503).json({
        status: false,
        message: "Security service temporarily unavailable. Please try again.",
      });
      return;
    }

    next();
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*splat}", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
server.listen(PORT, () => {
  connectDB();
  console.log(`server running on ${PORT}`);
});
