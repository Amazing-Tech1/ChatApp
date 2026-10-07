import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import msgRoutes from "./routes/msg.js";
import path from "path";
const app = express();
app.use(express.json());
const __dirname = path.resolve();
const PORT = Number(process.env.PORT) || 3000;
app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);
console.log("NODE_ENV:", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
    console.log("Serving frontend from:", path.join(__dirname, "../frontend/dist"));
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}
app.listen(PORT, () => console.log(`server running on ${PORT}`));
//# sourceMappingURL=server.js.map