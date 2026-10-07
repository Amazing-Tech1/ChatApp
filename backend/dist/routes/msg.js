import express, { Router } from "express";
const router = express.Router();
router.get("/send", (req, res) => {
    res.send("send message route");
});
router.get("/receive", (req, res) => {
    res.send("receive message route");
});
export default router;
//# sourceMappingURL=msg.js.map