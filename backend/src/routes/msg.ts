import express, { Router } from "express";
import { protectedRoute } from "../middleware/auth.js";
import {
  getAllContacts,
  getChatWithUser,
  sendMessage,
  getAllChats,
} from "../controllers/msgController.js";

const router: Router = express.Router();

router.use(protectedRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getAllChats);
router.get("/chats/:id", getChatWithUser);
router.post("/send/:id", sendMessage);

export default router;
