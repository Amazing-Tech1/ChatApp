import express, { Router } from "express";
import { signUp, logIn, logOut } from "../controllers/authController.js";

const router: Router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);


export default router;
