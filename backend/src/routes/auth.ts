import express, { Router } from "express";
import { signUp } from "../controllers/authController.js";

const router: Router = express.Router();

console.log("AUTH ROUTES LOADED");
router.post("/signup", signUp);
router.get("/login", (req, res) => {
  res.send("login route");
});
router.get("/logout", (req, res) => {
  res.send("logout route");
});

export default router;
