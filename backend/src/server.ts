import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import msgRoutes from "./routes/msg.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("api/auth", authRoutes);
app.use("api/messages", msgRoutes);

app.listen(PORT, () => console.log(`server running on ${PORT}`));
