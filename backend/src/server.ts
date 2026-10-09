import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import msgRoutes from "./routes/msg.js";
import path from "path";
import connectDB from "./lib/db.js";

const app = express();
app.use(express.json());

const __dirname = path.resolve();
const PORT = Number(process.env.PORT) || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*splat}", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
app.listen(PORT, () => {
  connectDB();
  console.log(`server running on ${PORT}`);
});
